import { prisma } from '../lib/prisma.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { category } = req.query;

      const images = await prisma.image.findMany({
        where: category ? { category } : undefined,
        orderBy: [
          { displayOrder: 'asc' },
          { createdAt: 'desc' }
        ]
      });

      res.status(200).json({ success: true, images });
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch images' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
