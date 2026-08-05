import { momNotesRepository } from '../repositories/momNotes.repository.js';
import { assertSchoolExists } from './schools.service.js';
import { validateAddMomNote } from '../validators/momNotes.validator.js';

export const momNotesService = {
  async list(schoolId) {
    await assertSchoolExists(schoolId);
    return momNotesRepository.findBySchool(schoolId);
  },

  async add(schoolId, payload) {
    await assertSchoolExists(schoolId);
    validateAddMomNote(payload);
    return momNotesRepository.create(schoolId, payload.content);
  },
};
