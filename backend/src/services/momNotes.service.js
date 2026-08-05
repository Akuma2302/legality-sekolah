import { momNotesRepository } from '../repositories/momNotes.repository.js';
import { assertSchoolAccess } from './schools.service.js';
import { validateAddMomNote } from '../validators/momNotes.validator.js';

export const momNotesService = {
  async list(user, schoolId) {
    await assertSchoolAccess(schoolId, user);
    return momNotesRepository.findBySchool(schoolId);
  },

  async add(user, schoolId, payload) {
    await assertSchoolAccess(schoolId, user);
    validateAddMomNote(payload);
    return momNotesRepository.create(schoolId, payload.content);
  },
};
