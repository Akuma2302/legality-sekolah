import { ApiError } from '../utils/ApiError.js';

export function validateSignin(body) {
  if (!body.username?.trim() || !body.password) {
    throw new ApiError(400, 'Username and password are required');
  }
}
