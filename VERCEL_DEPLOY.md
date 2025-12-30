# Vercel Deployment Guide

This project is configured to deploy both frontend and backend to Vercel using serverless functions.

## Project Structure

```
├── api/                    # Vercel Serverless Functions (Backend)
│   ├── images/
│   │   ├── index.js       # GET /api/images (list all)
│   │   ├── [id].js        # GET/PUT/DELETE /api/images/:id
│   │   └── upload.js      # POST /api/images/upload
│   └── lib/
│       ├── prisma.js      # Shared Prisma client
│       └── cloudinary.js  # Cloudinary config
├── src/                   # Frontend (Vite + React)
├── server/                # Legacy Express server (not used on Vercel)
└── vercel.json           # Vercel configuration
```

## Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "feat: Convert to Vercel serverless functions"
git push origin main
```

### 2. Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Vite configuration

### 3. Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

**Required Variables:**
```
DATABASE_URL=postgresql://neondb_owner:npg_giyofv8tVx5p@ep-wispy-lake-a4k9p967-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require

CLOUDINARY_CLOUD_NAME=duenspev2
CLOUDINARY_API_KEY=671315555943912
CLOUDINARY_API_SECRET=Xd3pFoujxuf-uaJvfAo4t4Akhw0

VITE_API_URL=/api
```

**Important:** Add these to all environments (Production, Preview, Development)

### 4. Deploy

Click "Deploy" - Vercel will:
1. Install dependencies
2. Generate Prisma Client
3. Build your Vite frontend
4. Deploy serverless functions to `/api/*` routes

### 5. Test Your Deployment

Once deployed, test these URLs:

- **Frontend:** `https://your-app.vercel.app/`
- **Admin Panel:** `https://your-app.vercel.app/admin`
- **API Health:** `https://your-app.vercel.app/api/images`

## How It Works

### Frontend
- Vite builds your React app as static files
- Deployed to Vercel's CDN
- Accesses API at `/api/*` (same domain, no CORS issues)

### Backend (Serverless Functions)
- Each file in `/api` becomes a serverless endpoint
- `/api/images/index.js` → `GET /api/images`
- `/api/images/upload.js` → `POST /api/images/upload`
- `/api/images/[id].js` → `GET/PUT/DELETE /api/images/:id`

### Database
- Prisma connects to your Neon PostgreSQL database
- Database URL configured via environment variable
- Shared Prisma client prevents connection exhaustion

### File Uploads
- Uses `multiparty` to handle multipart form data
- Uploads to Cloudinary
- Stores URLs in database

## API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/images` | GET | Get all images (optional ?category=portfolio) |
| `/api/images/upload` | POST | Upload new image to Cloudinary |
| `/api/images/:id` | GET | Get single image |
| `/api/images/:id` | PUT | Update image metadata |
| `/api/images/:id` | DELETE | Delete image from Cloudinary and DB |

## Troubleshooting

### Build Fails
- **Error:** "Prisma Client not generated"
- **Solution:** Ensure `prisma generate` runs in build script

### API 500 Errors
- **Error:** Database connection failed
- **Solution:** Verify DATABASE_URL in environment variables

### Images Not Uploading
- **Error:** Cloudinary errors
- **Solution:** Verify CLOUDINARY_* credentials are correct

### CORS Errors
- **Error:** API blocked by CORS
- **Solution:** CORS headers are set in API functions, should work automatically

## Local Development

For local development, you can still use the Express server:

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend (Express)
npm run server:dev
```

Update `.env` to use Express server:
```
VITE_API_URL=http://localhost:3001/api
```

## Database Migrations

If you change the Prisma schema:

```bash
# Create migration locally
npx prisma migrate dev --name your_migration_name

# Push to GitHub
git add prisma/
git commit -m "feat: Add database migration"
git push

# Vercel will auto-deploy
# Migrations run automatically via `prisma generate`
```

## Monitoring

- **Vercel Dashboard:** View function logs and analytics
- **Prisma Studio:** `npx prisma studio` to view database locally
- **Cloudinary Console:** Monitor image storage and bandwidth

## Cost Considerations

**Vercel Free Tier Includes:**
- 100GB bandwidth/month
- Serverless function execution time limits
- Unlimited deployments

**If You Exceed Free Tier:**
- Consider upgrading to Vercel Pro
- Or migrate backend to Render/Railway

## Support

For deployment issues:
- Check Vercel function logs
- Verify all environment variables are set
- Test API endpoints directly

Happy deploying! 🚀
