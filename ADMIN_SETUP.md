# Admin Panel Setup Guide

This guide will help you set up and use the admin panel for managing portfolio images.

## Prerequisites

1. Node.js installed
2. Neon PostgreSQL database (already configured)
3. Cloudinary account

## Setup Steps

### 1. Configure Environment Variables

Update the `.env` file with your Cloudinary credentials:

```env
# Database (already configured)
DATABASE_URL="postgresql://neondb_owner:npg_giyofv8tVx5p@ep-wispy-lake-a4k9p967-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Cloudinary credentials - GET THESE FROM YOUR CLOUDINARY DASHBOARD
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here

# Server port
PORT=3001
```

### 2. Get Cloudinary Credentials

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Sign up or log in
3. On the dashboard, you'll find:
   - **Cloud Name**
   - **API Key**
   - **API Secret**
4. Copy these values and paste them into your `.env` file

### 3. Database Setup

The database is already configured and migrated. The `Image` table has been created with the following schema:

```prisma
model Image {
  id          Int      @id @default(autoincrement())
  url         String
  title       String?
  description String?
  category    String   @default("portfolio")
  displayOrder Int     @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Running the Application

### Start the Backend Server

Open a terminal and run:

```bash
npm run server:dev
```

The server will start at `http://localhost:3001`

### Start the Frontend

Open another terminal and run:

```bash
npm run dev
```

The frontend will start at `http://localhost:5173` (or another port if 5173 is busy)

## Using the Admin Panel

### Accessing the Admin Panel

Navigate to: `http://localhost:5173/admin`

### Uploading Images

1. Click "Choose File" to select an image
2. (Optional) Add a title for the image
3. (Optional) Add a description
4. Select a category (portfolio, hero, featured)
5. Set display order (lower numbers appear first)
6. Click "Upload Image"

### Managing Images

- **View All Images**: All uploaded images are displayed in a grid
- **Delete Images**: Click the "Delete" button on any image card
- **Refresh List**: Click "Refresh" to reload images from the database

### Categories

- **portfolio**: Images for the portfolio carousel on the home page
- **hero**: Hero section images
- **featured**: Featured images (for future use)

## How It Works

1. **Upload Flow**:
   - Image is uploaded from the admin panel
   - Server receives the image and uploads it to Cloudinary
   - Cloudinary returns a secure URL
   - Server saves the URL and metadata to the Neon database

2. **Display Flow**:
   - Home page fetches images from the database
   - Images are filtered by category (portfolio)
   - Images are sorted by displayOrder, then by creation date
   - If API is unavailable, falls back to static images

## API Endpoints

- `GET /api/images` - Get all images (optional ?category=portfolio filter)
- `GET /api/images/:id` - Get single image by ID
- `POST /api/images/upload` - Upload new image
- `PUT /api/images/:id` - Update image metadata
- `DELETE /api/images/:id` - Delete image

## Troubleshooting

### Server won't start
- Check that port 3001 is not in use
- Verify .env file exists and has correct values
- Run `npm install` to ensure all dependencies are installed

### Images not uploading
- Verify Cloudinary credentials in .env
- Check file size (10MB limit)
- Check file type (images only)

### Database connection issues
- Verify DATABASE_URL is correct
- Check internet connection (Neon is cloud-based)
- Run `npx prisma generate` to regenerate Prisma Client

## Production Deployment

Before deploying to production:

1. Update API_URL in:
   - `src/pages/Admin.jsx`
   - `src/pages/Home.jsx`

2. Set environment variables on your hosting platform

3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```

4. Build the frontend:
   ```bash
   npm run build
   ```

## Security Note

The admin panel currently has no authentication. For production use, you should:

1. Add authentication (username/password or OAuth)
2. Protect the `/admin` route
3. Add API authentication middleware
4. Use HTTPS in production
5. Add rate limiting to prevent abuse

## Support

For issues or questions, contact the development team.
