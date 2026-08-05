import { ApiError } from '../utils/ApiError.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignup(body) {
  const { email, password, full_name } = body;
  if (!email?.trim() || !EMAIL_RE.test(email.trim())) {
    throw new ApiError(400, 'A valid email is required');
  }
  if (!password || password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }
  if (!full_name?.trim()) {
    throw new ApiError(400, 'Full name is required');
  }
}

export function validateSignin(body) {
  if (!body.email?.trim() || !body.password) {
    throw new ApiError(400, 'Email and password are required');
  }
}
