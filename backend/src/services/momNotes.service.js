import { momNotesRepository } from '../repositories/momNotes.repository.js';
import { assertParentExists } from '../utils/parentResolver.js';
import { validateAddMomNote } from '../validators/momNotes.validator.js';

export const momNotesService = {
  async list(parentType, parentId) {
    const { refName } = await assertParentExists(parentType, parentId);
    return momNotesRepository.findByParent(refName, parentId);
  },

  async add(parentType, parentId, payload) {
    const { refName } = await assertParentExists(parentType, parentId);
    validateAddMomNote(payload);
    return momNotesRepository.create(refName, parentId, payload.content);
  },
};
