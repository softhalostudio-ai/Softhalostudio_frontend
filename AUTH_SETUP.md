# Authentication Setup Guide

The admin panel is now protected with JWT-based authentication.

## Setting Up Admin Credentials

### Step 1: Generate Password Hash

You need to generate a bcrypt hash for your admin password. Here's how:

**Option A: Using the Helper Endpoint (Easiest)**

1. Deploy your app or run it locally
2. Use curl, Postman, or your browser console:

```bash
curl -X POST https://your-app.vercel.app/api/auth/generate-hash \
  -H "Content-Type: application/json" \
  -d '{"password": "your-secure-password"}'
```

Or in JavaScript console:
```javascript
fetch('/api/auth/generate-hash', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ password: 'your-secure-password' })
}).then(r => r.json()).then(console.log)
```

3. Copy the `hash` from the response

**Option B: Using bcrypt CLI**

```bash
npm install -g bcrypt-cli
bcrypt-cli your-password-here
```

### Step 2: Add Environment Variables

Add these to your Vercel environment variables (or `.env` for local):

```env
# JWT Secret (use a long random string)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<paste-the-hash-from-step-1>
```

**Generate JWT_SECRET:**
```bash
# In Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Redeploy

After adding environment variables, redeploy your app or restart your server.

### Step 4: Test Login

1. Go to `/login`
2. Enter your username (default: `admin`)
3. Enter the password you used in Step 1
4. You should be redirected to `/admin`

## Changing Admin Credentials

### Change Username

Update the `ADMIN_USERNAME` environment variable and redeploy.

### Change Password

1. Generate a new hash for your new password (see Step 1)
2. Update `ADMIN_PASSWORD_HASH` environment variable
3. Redeploy

## Security Notes

### IMPORTANT: Remove generate-hash Endpoint in Production!

The `/api/auth/generate-hash` endpoint is a helper for setting up. For security:

**Delete or disable this file after setup:**
```
api/auth/generate-hash.js
```

Or add authentication to it in `api/auth/generate-hash.js`:
```javascript
import { requireAuth } from '../lib/auth.js';
export default requireAuth(handler);
```

### JWT Token Expiration

Tokens expire after **7 days**. Users will need to log in again after that.

To change expiration, edit `api/lib/auth.js`:
```javascript
export function generateToken(username) {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' }); // Change '7d' to '1d', '12h', etc.
}
```

### Secure JWT_SECRET

- Use a strong, random string (minimum 32 characters)
- Never commit it to git
- Keep it in environment variables only
- Rotate it periodically for extra security

### HTTPS Only

Always use HTTPS in production to protect credentials in transit.

## How It Works

### Protected Routes

**Frontend:**
- `/admin` requires authentication
- Redirects to `/login` if not authenticated
- Token stored in localStorage

**API Endpoints:**
- `POST /api/images/upload` - Protected ✓
- `PUT /api/images/:id` - Protected ✓
- `DELETE /api/images/:id` - Protected ✓
- `GET /api/images` - Public (for displaying on site)
- `GET /api/images/:id` - Public

### Authentication Flow

1. User enters credentials on `/login`
2. `POST /api/auth/login` verifies credentials
3. Server returns JWT token
4. Frontend stores token in localStorage
5. Frontend includes token in `Authorization: Bearer <token>` header
6. Protected endpoints verify token before processing request

### Logout

Click "Logout" button in admin panel to:
- Clear token from localStorage
- Redirect to `/login`

## Troubleshooting

### "Invalid credentials" Error

- Check that `ADMIN_USERNAME` matches what you're typing
- Verify `ADMIN_PASSWORD_HASH` is correct
- Ensure you're using the password you hashed, not the hash itself

### "Unauthorized" on API Calls

- Token might be expired (7 days default)
- Token might be invalid
- Environment variables might not be set on server
- Try logging out and back in

### Can't Access /admin

- Make sure you're logged in
- Check browser console for errors
- Verify token exists: `localStorage.getItem('adminToken')`

### Token Not Working After Changing JWT_SECRET

If you change `JWT_SECRET`, all existing tokens become invalid. Users must log in again.

## Multiple Admins (Future Enhancement)

Currently supports one admin user. To add multiple:

1. Create a `users` table in Prisma
2. Store multiple username/password hashes
3. Update `verifyAdminCredentials` to query database
4. Add user management in admin panel

## Example: Testing with cURL

```bash
# Login
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "your-password"}' \
  > token.json

# Extract token (requires jq)
TOKEN=$(cat token.json | jq -r '.token')

# Upload image with authentication
curl -X POST https://your-app.vercel.app/api/images/upload \
  -H "Authorization: Bearer $TOKEN" \
  -F "image=@photo.jpg" \
  -F "title=Test Image" \
  -F "category=portfolio"
```

## Security Checklist

- [ ] Generated strong JWT_SECRET
- [ ] Created secure admin password
- [ ] Added all environment variables to Vercel
- [ ] Tested login works
- [ ] Removed or protected generate-hash endpoint
- [ ] Verified .env is in .gitignore
- [ ] Using HTTPS in production
- [ ] Changed default username from 'admin'
