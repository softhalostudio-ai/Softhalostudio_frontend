import { hashPassword } from '../lib/auth.js';

// Helper endpoint to generate password hash
// IMPORTANT: Remove or disable this endpoint in production!
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ error: 'Password required' });
      }

      const hash = await hashPassword(password);

      res.status(200).json({
        success: true,
        hash,
        message: 'Use this hash as ADMIN_PASSWORD_HASH environment variable'
      });
    } catch (error) {
      console.error('Hash generation error:', error);
      res.status(500).json({ error: 'Failed to generate hash' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
