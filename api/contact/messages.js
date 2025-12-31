import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../lib/auth.js';

const prisma = new PrismaClient();

// CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

async function getMessages(req, res) {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
}

async function markAsRead(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Message ID is required',
      });
    }

    const message = await prisma.contactMessage.update({
      where: { id: parseInt(id) },
      data: { read: true },
    });

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to update message',
    });
  }
}

async function deleteMessage(req, res) {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: 'Message ID is required',
      });
    }

    await prisma.contactMessage.delete({
      where: { id: parseInt(id) },
    });

    return res.status(200).json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to delete message',
    });
  }
}

export default async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    return requireAuth(getMessages)(req, res);
  }

  if (req.method === 'PATCH') {
    return requireAuth(markAsRead)(req, res);
  }

  if (req.method === 'DELETE') {
    return requireAuth(deleteMessage)(req, res);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
