import { ApiError } from '../utils/ApiError.js';

export function validateAddTeacher(body) {
  if (!body.name?.trim()) {
    throw new ApiError(400, 'Teacher name is required');
  }
}
