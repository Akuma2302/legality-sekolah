import { ApiError } from '../utils/ApiError.js';

export function validateCreateRandom(body) {
  const { school_name, pic_name, type } = body;
  if (!school_name?.trim() || !pic_name?.trim() || !type) {
    throw new ApiError(400, 'school_name, pic_name and type are required');
  }
}