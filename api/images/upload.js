import { prisma } from '../lib/prisma.js';
import cloudinary from '../lib/cloudinary.js';
import multiparty from 'multiparty';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Form parse error:', err);
        return res.status(400).json({ error: 'Failed to parse form data' });
      }

      const file = files.image?.[0];
      if (!file) {
        return res.status(400).json({ error: 'No image file provided' });
      }

      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'soft-halo-studio',
          resource_type: 'image'
        });

        // Save to database
        const title = fields.title?.[0] || null;
        const description = fields.description?.[0] || null;
        const category = fields.category?.[0] || 'portfolio';
        const displayOrder = parseInt(fields.displayOrder?.[0]) || 0;

        const image = await prisma.image.create({
          data: {
            url: result.secure_url,
            title,
            description,
            category,
            displayOrder
          }
        });

        res.status(200).json({
          success: true,
          image,
          message: 'Image uploaded successfully'
        });
      } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Failed to upload image' });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
