import { schoolsRepository } from '../repositories/schools.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { EDITABLE_SCHOOL_FIELDS } from '../models/school.model.js';
import { validateCreateSchool, validateLegalityStatus } from '../validators/schools.validator.js';

/** Shared by teachers/momNotes services too, so they can confirm the parent school exists. */
export async function assertSchoolExists(schoolId) {
  const school = await schoolsRepository.findById(schoolId);
  if (!school) throw new ApiError(404, 'School not found');
  return school;
}

export const schoolsService = {
  list: () => schoolsRepository.findAll(),

  async create(payload) {
    validateCreateSchool(payload);
    const { school_name, pic_name, type } = payload;
    return schoolsRepository.create({ school_name, pic_name, type });
  },

  async getById(id) {
    return assertSchoolExists(id);
  },

  async update(id, payload) {
    await assertSchoolExists(id);

    // Public route — legality_status is intentionally never accepted here.
    // It can only be changed through PATCH /:id/legality-status, which requires an admin login.
    const updates = {};
    for (const field of EDITABLE_SCHOOL_FIELDS) {
      if (payload[field] !== undefined) updates[field] = payload[field];
    }

    return schoolsRepository.update(id, updates);
  },

  async remove(id) {
    await assertSchoolExists(id);
    return schoolsRepository.remove(id);
  },

  async updateLegalityStatus(id, legality_status) {
    validateLegalityStatus(legality_status);
    await assertSchoolExists(id);
    return schoolsRepository.update(id, { legality_status });
  },
};
