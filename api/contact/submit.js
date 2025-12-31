import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();

// Create email transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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
      await transporter.sendMail({
        from: `"Soft Halo Studio Website" <${process.env.EMAIL_USER}>`,
        to: 'softhalostudio@gmail.com',
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #26a69a; border-bottom: 2px solid #26a69a; padding-bottom: 10px;">
              New Contact Form Submission
            </h2>
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              ${phone ? `<p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>` : ''}
              ${service ? `<p><strong>Service Interested In:</strong> ${service}</p>` : ''}
            </div>
            <div style="margin: 20px 0;">
              <p><strong>Message:</strong></p>
              <p style="background-color: #fff; padding: 15px; border-left: 4px solid #26a69a;">${message}</p>
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              This message was sent via the contact form on your website.
            </p>
          </div>
        `,
        replyTo: email,
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
