import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const EXPIRES_IN = '7d';

export function signToken(userId) {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: EXPIRES_IN });
}

/** Returns the decoded payload, or null if the token is missing/invalid/expired. */
export function verifyToken(token) {
  try {
    return jwt.verify(token, env.jwtSecret);
  } catch {
    return null;
  }
}
