// src/pages/api/apply.js
import { Resend } from 'resend';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST = async ({ request }) => {
  try {
    const data = await request.formData();
    
    // Extract candidate application metadata
    const position = data.get('applied_position');
    const name = data.get('name');
    const email = data.get('email');
    const phone = data.get('phone');
    const portfolio = data.get('portfolio');
    const coverLetter = data.get('cover_letter');
    
    // Process the singular PDF Resume file
    const resumeFile = data.get('attachment');
    const attachments = [];

    if (resumeFile && resumeFile.size > 0) {
      const arrayBuffer = await resumeFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      attachments.push({
        filename: resumeFile.name || 'resume.pdf',
        content: buffer,
      });
    }

    // Format clean professional inbox template
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #22d3ee; margin-bottom: 4px;">🚀 New Job Application</h2>
        <p style="color: #64748b; font-size: 14px; margin-top: 0;">ZetaLogix Careers Portal</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Target Role:</td><td style="color: #22d3ee; font-weight: bold;">${position}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Applicant Name:</td><td>${name}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Email Address:</td><td>${email}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Phone Number:</td><td>${phone || 'Not provided'}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Profiles/Portfolio:</td><td>${portfolio ? `<a href="${portfolio}" style="color: #3b82f6;">${portfolio}</a>` : 'Not provided'}</td></tr>
        </table>
        
        <h3 style="margin-top: 24px; border-top: 1px solid #eee; padding-top: 16px; color: #334155;">Introduction / Cover Notes:</h3>
        <p style="background: #f8fafc; padding: 15px; border-radius: 8px; color: #475569; white-space: pre-line; font-size: 14px; line-height: 1.6;">${coverLetter || 'No cover letter provided.'}</p>
      </div>
    `;

    // Dispatch payload to Resend integration core
    const { data: resendData, error } = await resend.emails.send({
      from: 'ZetaLogix Careers <onboarding@resend.dev>', // Change to info@zetalogix.com post-domain setup!
      to: ['zeeshanachra1@gmail.com'],
      reply_to: email, // Instantly hit reply to email the applicant back!
      subject: `[Job Application] ${name} - ${position}`,
      html: emailHtml,
      attachments: attachments,
    });

    if (error) {
      console.error("Resend Processing Reject:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error("Critical Careers Transmission Fault:", error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};