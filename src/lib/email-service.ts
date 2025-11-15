interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: ContactFormData): Promise<boolean> {
  try {
    // Create email content
    const emailContent = `
New Contact Form Submission

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone || 'Not provided'}
Company: ${data.company || 'Not provided'}
Subject: ${data.subject}

Message:
${data.message}

---
Submitted on: ${new Date().toLocaleString()}
    `.trim();

    // For immediate implementation, we'll use a webhook service
    // You can replace this with your preferred email service
    
    // Option 1: Use a webhook service like Zapier, Make.com, or n8n
    if (process.env.WEBHOOK_URL) {
      await fetch(process.env.WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: 'nyala.trip@gmail.com',
          subject: `Contact Form: ${data.subject}`,
          content: emailContent,
          from: data.email,
          replyTo: data.email
        }),
      });
    }
    
    // Option 2: Use Resend (recommended for production)
    if (process.env.RESEND_API_KEY) {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      const result = await resend.emails.send({
        from: 'Nyala Contact Form <onboarding@resend.dev>', // Use Resend's default domain for now
        to: ['ahmed.pruo@gmail.com'], // Send to your verified email first
        subject: `Contact Form: ${data.subject}`,
        html: formatContactEmailHTML(data),
        text: emailContent,
        replyTo: data.email
      });
      
      console.log('✅ Email sent via Resend:', result);
      return true;
    }
    
    // Option 3: Use SendGrid
    if (process.env.SENDGRID_API_KEY) {
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      await sgMail.send({
        to: 'nyala.trip@gmail.com',
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@neyala.com',
        subject: `Contact Form: ${data.subject}`,
        text: emailContent,
        replyTo: data.email
      });
    }
    
    // Option 4: Use Nodemailer with SMTP
    if (process.env.SMTP_HOST) {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });
      
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@neyala.com',
        to: 'nyala.trip@gmail.com',
        subject: `Contact Form: ${data.subject}`,
        text: emailContent,
        replyTo: data.email
      });
    }
    
    // Fallback: Log to console (for development)
    console.log('📧 Email to send to nyala.trip@gmail.com:');
    console.log('Subject:', `Contact Form: ${data.subject}`);
    console.log('From:', data.email);
    console.log('Content:', emailContent);
    
    return true;
    
  } catch (error) {
    console.error('Error sending contact email:', error);
    return false;
  }
}

// Helper function to format email content as HTML
export function formatContactEmailHTML(data: ContactFormData): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #2563eb;">New Contact Form Submission</h2>
      
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p><strong>Phone:</strong> ${data.phone || 'Not provided'}</p>
        <p><strong>Company:</strong> ${data.company || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
      </div>
      
      <div style="background: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
        <h3 style="color: #374151; margin-top: 0;">Message:</h3>
        <p style="white-space: pre-wrap; line-height: 1.6;">${data.message}</p>
      </div>
      
      <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
        <p>Submitted on: ${new Date().toLocaleString()}</p>
        <p>Reply directly to this email to respond to ${data.firstName}.</p>
      </div>
    </div>
  `;
}
