import express from 'express';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();
const prisma = new PrismaClient();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Upload image to Cloudinary and save to database
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'soft-halo-studio',
        resource_type: 'image'
      },
      async (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ error: 'Failed to upload to Cloudinary' });
        }

        try {
          // Save to database
          const { title, description, category = 'portfolio', displayOrder = 0 } = req.body;

          const image = await prisma.image.create({
            data: {
              url: result.secure_url,
              title: title || null,
              description: description || null,
              category,
              displayOrder: parseInt(displayOrder) || 0
            }
          });

          res.json({
            success: true,
            image,
            message: 'Image uploaded successfully'
          });
        } catch (dbError) {
          console.error('Database error:', dbError);
          res.status(500).json({ error: 'Failed to save image to database' });
        }
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Get all images (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    const images = await prisma.image.findMany({
      where: category ? { category } : undefined,
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' }
      ]
    });

    res.json({ success: true, images });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
});

// Get single image by ID
router.get('/:id', async (req, res) => {
  try {
    const image = await prisma.image.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.json({ success: true, image });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch image' });
  }
});

// Update image metadata
router.put('/:id', async (req, res) => {
  try {
    const { title, description, category, displayOrder } = req.body;

    const image = await prisma.image.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder) })
      }
    });

    res.json({ success: true, image, message: 'Image updated successfully' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update image' });
  }
});

// Delete image
router.delete('/:id', async (req, res) => {
  try {
    const image = await prisma.image.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Extract public_id from Cloudinary URL to delete from Cloudinary
    const urlParts = image.url.split('/');
    const publicIdWithExt = urlParts.slice(-2).join('/'); // folder/filename.ext
    const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (cloudinaryError) {
      console.error('Cloudinary deletion error:', cloudinaryError);
      // Continue with database deletion even if Cloudinary fails
    }

    await prisma.image.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
