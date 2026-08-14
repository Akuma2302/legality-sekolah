import { ApiError } from '../utils/ApiError.js';
import { PROGRAM_TYPES, BRANCHES } from '../models/programSubmission.model.js';

export function validateProgramSubmission(body) {
  const required = [
    'school_name', 'school_branch', 'program_date', 'program_type', 'start_time', 'end_time',
    'teacher_on_duty', 'teacher_position', 'total_manpower',
    'main_pic_telegram', 'main_pic_branch',
    'legality_pic_telegram', 'legality_pic_branch',
    'virality_pic_telegram', 'virality_pic_branch',
  ];
  for (const field of required) {
    if (body[field] === undefined || body[field] === null || body[field] === '') {
      throw new ApiError(400, `${field} is required`);
    }
  }

  if (!PROGRAM_TYPES.includes(body.program_type)) {
    throw new ApiError(400, `program_type must be one of: ${PROGRAM_TYPES.join(', ')}`);
  }

  for (const field of ['school_branch', 'main_pic_branch', 'legality_pic_branch', 'virality_pic_branch']) {
    if (!BRANCHES.includes(body[field])) {
      throw new ApiError(400, `${field} must be one of: ${BRANCHES.join(', ')}`);
    }
  }

  if (!body.virality_ack_before_1 || !body.virality_ack_before_2 || !body.virality_ack_after_1) {
    throw new ApiError(400, 'All Ketetapan Virality commitments must be confirmed before submitting');
  }
}
