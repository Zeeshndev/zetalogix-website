// src/pages/api/contact.js
import { Resend } from 'resend';

export const prerender = false; // Ensures this endpoint runs dynamically on the server

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 
  'application/pdf', 
  'application/msword', 
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const POST = async ({ request }) => {
  try {
    const data = await request.formData();
    
    // 1. Honeypot Spam Protection (Bots fill hidden fields, humans do not)
    if (data.get('_honeypot')) {
      return new Response(JSON.stringify({ error: 'Spam detected.' }), { status: 400 });
    }
    
    // 2. Extract fields
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const messageRaw = data.get('message')?.toString().trim();
    
    // 3. Required Field Validation
    if (!name || !email || !messageRaw) {
      return new Response(JSON.stringify({ error: 'Name, Email, and Message are required.' }), { status: 400 });
    }

    // 4. Email Format Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email format.' }), { status: 400 });
    }

    // 5. Message Length Validation (Max 5000 chars)
    if (messageRaw.length > 5000) {
      return new Response(JSON.stringify({ error: 'Message exceeds maximum length of 5000 characters.' }), { status: 400 });
    }

    // 6. Data Sanitization (Basic HTML escaping to prevent XSS)
    const message = messageRaw.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Optional Fields
    const phoneCode = data.get('country_code') || '';
    const phone = data.get('phone') || 'Not provided';
    const source = data.get('source') || 'Not provided';
    const budget = data.get('budget') || 'Not provided';
    const engagement = data.get('engagement') || 'Not provided';

    // 7. File Validation (Max 2, Max 5MB, Allowed Types)
    const files = data.getAll('files');
    const validFiles = files.filter(f => f.name && f.size > 0);
    
    if (validFiles.length > 2) {
      return new Response(JSON.stringify({ error: 'Maximum of 2 files allowed.' }), { status: 400 });
    }

    const attachments = [];
    for (const file of validFiles) {
      if (file.size > MAX_FILE_SIZE) {
        return new Response(JSON.stringify({ error: `File ${file.name} exceeds 5MB limit.` }), { status: 400 });
      }
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return new Response(JSON.stringify({ error: `File type ${file.type} is not allowed.` }), { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      attachments.push({
        filename: file.name,
        content: buffer,
      });
    }

    // 8. Construct Email
    const emailHtml = `
      <h2>New Project Inquiry from ZetaLogix Website</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phoneCode} ${phone}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Engagement Model:</strong> ${engagement}</p>
      <p><strong>Source:</strong> ${source}</p>
      <hr />
      <h3>Project Description:</h3>
      <p style="white-space: pre-wrap;">${message}</p>
    `;

    // 9. Send via Resend
    const { data: resendData, error } = await resend.emails.send({
      from: 'ZetaLogix Inquiries <info@zetalogix.com>', 
      to: ['zeeshanachra1@gmail.com'], 
      reply_to: email, // Added Reply-To header so you can click reply instantly
      subject: `New Lead: ${name} - ${budget}`,
      html: emailHtml,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, message: 'Message sent successfully!' }), { status: 200 });

  } catch (error) {
    console.error('Submission Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};