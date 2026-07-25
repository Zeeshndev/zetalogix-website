// src/pages/api/contact.js
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST = async ({ request }) => {
  try {
    // 1. Get the form data from the frontend request
    const data = await request.formData();
    
    // 2. Extract text fields
    const name = data.get('name');
    const email = data.get('email');
    const phoneCode = data.get('country_code');
    const phone = data.get('phone');
    const source = data.get('source');
    const budget = data.get('budget');
    const engagement = data.get('engagement');
    const message = data.get('message');

    // 3. Process File Attachments
    const files = data.getAll('files');
    const attachments = [];

    for (const file of files) {
      if (file.size > 0) {
        // Convert the file into a Buffer that Resend can read
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        attachments.push({
          filename: file.name,
          content: buffer,
        });
      }
    }

    // 4. Construct the Email HTML
    const emailHtml = `
      <h2>New Project Inquiry from ZetaLogix Website</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phoneCode} ${phone}</p>
      <p><strong>Budget:</strong> ${budget}</p>
      <p><strong>Engagement Model:</strong> ${engagement}</p>
      <p><strong>Source:</strong> ${source}</p>
      <h3>Message:</h3>
      <p>${message}</p>
    `;

   // src/pages/api/contact.js (Line 38)

    // src/pages/api/contact.js

    // 5. Send via Resend (Fully Production Ready)
    const { data: resendData, error } = await resend.emails.send({
      from: 'ZetaLogix Inquiries <info@zetalogix.com>', // Must be an email at your verified domain
      to: ['zeeshanachra1@gmail.com'], // The email address where you want to receive client leads
      subject: `New Lead: ${name} - ${budget}`,
      html: emailHtml,
      attachments: attachments,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true, message: 'Message sent successfully!' }), { status: 200 });

  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};