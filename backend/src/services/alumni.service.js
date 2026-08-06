import { alumniRepository } from '../repositories/alumni.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { EDITABLE_ALUMNI_FIELDS } from '../models/alumni.model.js';
import { validateCreateAlumni } from '../validators/alumni.validator.js';

export async function assertAlumniExists(id) {
  const alumnus = await alumniRepository.findById(id);
  if (!alumnus) throw new ApiError(404, 'Alumni entry not found');
  return alumnus;
}

export const alumniService = {
  list: () => alumniRepository.findAll(),

  async create(payload) {
    validateCreateAlumni(payload);
    const { school_name, pic_name, type } = payload;
    return alumniRepository.create({ school_name, pic_name, type });
  },

  async getById(id) {
    return assertAlumniExists(id);
  },

  async update(id, payload) {
    await assertAlumniExists(id);

    const updates = {};
    for (const field of EDITABLE_ALUMNI_FIELDS) {
      if (payload[field] !== undefined) updates[field] = payload[field];
    }

    return alumniRepository.update(id, updates);
  },

  async remove(id) {
    await assertAlumniExists(id);
    return alumniRepository.remove(id);
  },
};
