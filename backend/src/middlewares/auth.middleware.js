import { verifyToken } from '../utils/jwt.js';
import { usersRepository } from '../repositories/users.repository.js';

/**
 * Verifies the JWT sent from the frontend (Authorization: Bearer <token>)
 * and attaches { id, role, fullName } to req.user.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const payload = verifyToken(token);
  if (!payload?.sub) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const user = await usersRepository.findById(payload.sub);
  if (!user) {
    return res.status(401).json({ error: 'No account found for this token' });
  }

  req.user = { id: user.id, role: user.role, fullName: user.full_name };
  next();
}

/** Restricts a route to admin-role accounts only. Use after requireAuth. */
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
