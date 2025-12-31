import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // TODO: Send email notification to softhalostudio@gmail.com
    // For now, we'll just save to database
    // You can integrate Resend, SendGrid, or Nodemailer here

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
