import { ApiError } from '../utils/ApiError.js';

export function validateAddMomNote(body) {
  if (!body.content?.trim()) {
    throw new ApiError(400, 'content is required');
  }
}
