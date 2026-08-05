import { schoolsRepository } from '../repositories/schools.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { EDITABLE_SCHOOL_FIELDS } from '../models/school.model.js';
import { validateCreateSchool, validateLegalityStatus } from '../validators/schools.validator.js';

/** Shared by teachers/momNotes services too, so they can check access to the parent school. */
export async function assertSchoolAccess(schoolId, user) {
  const school = await schoolsRepository.findById(schoolId);
  if (!school) throw new ApiError(404, 'School not found');
  if (user.role !== 'admin' && school.owner_id !== user.id) {
    throw new ApiError(403, 'Not your school');
  }
  return school;
}

export const schoolsService = {
  listMine: (user) => schoolsRepository.findByOwner(user.id),

  listAll: () => schoolsRepository.findAll(),

  async create(user, payload) {
    validateCreateSchool(payload);
    const { school_name, pic_name, type } = payload;
    return schoolsRepository.create({ school_name, pic_name, type, owner_id: user.id });
  },

  async getById(user, id) {
    return assertSchoolAccess(id, user);
  },

  async update(user, id, payload) {
    await assertSchoolAccess(id, user);

    const updates = {};
    for (const field of EDITABLE_SCHOOL_FIELDS) {
      if (payload[field] !== undefined) updates[field] = payload[field];
    }
    // Only admins may change legality_status through the general update route
    if (user.role === 'admin' && payload.legality_status !== undefined) {
      validateLegalityStatus(payload.legality_status);
      updates.legality_status = payload.legality_status;
    }

    return schoolsRepository.update(id, updates);
  },

  async remove(user, id) {
    await assertSchoolAccess(id, user);
    return schoolsRepository.remove(id);
  },

  async updateLegalityStatus(id, legality_status) {
    validateLegalityStatus(legality_status);
    const school = await schoolsRepository.findById(id);
    if (!school) throw new ApiError(404, 'School not found');
    return schoolsRepository.update(id, { legality_status });
  },
};
