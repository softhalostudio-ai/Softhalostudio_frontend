import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

// CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, phone, service, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required'
      });
    }

    // Save to database
    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        service: service || null,
        message,
      },
    });

    // Send email notification to softhalostudio@gmail.com
    try {
      await resend.emails.send({
        from: 'Soft Halo Studio <onboarding@resend.dev>',
        to: ['softhalostudio@gmail.com'],
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${service ? `<p><strong>Service Interested In:</strong> ${service}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p>${message}</p>
          <hr>
          <p><small>This message was sent via the contact form on your website.</small></p>
        `,
      });
      console.log('Email sent successfully to softhalostudio@gmail.com');
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Don't fail the request if email fails - message is still saved to database
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully! We will get back to you soon.',
      id: contactMessage.id,
    });
  } catch (error) {
    console.error('Error saving contact message:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.',
    });
  }
}
