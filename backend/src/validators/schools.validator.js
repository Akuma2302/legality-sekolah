import { ApiError } from '../utils/ApiError.js';
import { LEGALITY_STATUSES } from '../models/school.model.js';

export function validateCreateSchool(body) {
  const { school_name, pic_name, type } = body;
  if (!school_name?.trim() || !pic_name?.trim() || !type) {
    throw new ApiError(400, 'school_name, pic_name and type are required');
  }
}

export function validateLegalityStatus(status) {
  if (!LEGALITY_STATUSES.includes(status)) {
    throw new ApiError(400, `legality_status must be one of: ${LEGALITY_STATUSES.join(', ')}`);
  }
}
