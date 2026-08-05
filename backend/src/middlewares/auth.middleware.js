import { supabase } from '../config/supabase.js';

/**
 * Verifies the Supabase JWT sent from the frontend (Authorization: Bearer <token>)
 * and attaches { id, role, fullName } to req.user.
 */
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'Missing auth token' });
  }

  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', data.user.id)
    .single();

  if (profileError || !profile) {
    return res.status(401).json({ error: 'No profile found for user' });
  }

  req.user = { id: data.user.id, role: profile.role, fullName: profile.full_name };
  next();
}

/** Restricts a route to admin-role profiles only. Use after requireAuth. */
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}
