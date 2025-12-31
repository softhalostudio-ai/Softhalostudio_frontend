import { prisma } from '../lib/prisma.js';
import cloudinary from '../lib/cloudinary.js';
import { requireAuth } from '../lib/auth.js';

async function imageHandler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { id } = req.query;
  const imageId = parseInt(id);

  if (req.method === 'GET') {
    try {
      const image = await prisma.image.findUnique({
        where: { id: imageId }
      });

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      res.status(200).json({ success: true, image });
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch image' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { title, description, category, displayOrder } = req.body;

      const image = await prisma.image.update({
        where: { id: imageId },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(category !== undefined && { category }),
          ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) })
        }
      });

      res.status(200).json({ success: true, image, message: 'Image updated successfully' });
    } catch (error) {
      console.error('Update error:', error);
      res.status(500).json({ error: 'Failed to update image' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const image = await prisma.image.findUnique({
        where: { id: imageId }
      });

      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // Extract public_id from Cloudinary URL to delete from Cloudinary
      const urlParts = image.url.split('/');
      const publicIdWithExt = urlParts.slice(-2).join('/');
      const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
        // Continue with database deletion even if Cloudinary fails
      }

      await prisma.image.delete({
        where: { id: imageId }
      });

      res.status(200).json({ success: true, message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Delete error:', error);
      res.status(500).json({ error: 'Failed to delete image' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Protect PUT and DELETE, allow GET without auth
export default async function handler(req, res) {
  if (req.method === 'GET') {
    return imageHandler(req, res);
  } else {
    return requireAuth(imageHandler)(req, res);
  }
}
