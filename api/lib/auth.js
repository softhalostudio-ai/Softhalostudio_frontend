import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

// Generate a hash for a password (use this to create ADMIN_PASSWORD_HASH)
export async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

// Verify password against hash
export async function verifyPassword(password, hash) {
  return await bcrypt.compare(password, hash);
}

// Generate JWT token
export function generateToken(username) {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' });
}

// Verify JWT token
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

// Middleware to verify authentication
export function requireAuth(handler) {
  return async (req, res) => {
    try {
      // Get token from Authorization header
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized - No token provided' });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const decoded = verifyToken(token);

      if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
      }

      // Add user info to request
      req.user = decoded;

      // Call the actual handler
      return handler(req, res);
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
}

// Verify admin credentials
export async function verifyAdminCredentials(username, password) {
  if (username !== ADMIN_USERNAME) {
    return false;
  }

  if (!ADMIN_PASSWORD_HASH) {
    console.error('ADMIN_PASSWORD_HASH not set in environment variables');
    return false;
  }

  return await verifyPassword(password, ADMIN_PASSWORD_HASH);
}
