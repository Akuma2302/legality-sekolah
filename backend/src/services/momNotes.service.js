import { momNotesRepository } from '../repositories/momNotes.repository.js';
import { assertParentExists } from '../utils/parentResolver.js';
import { validateAddMomNote } from '../validators/momNotes.validator.js';
import { ApiError } from '../utils/ApiError.js';

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

  async update(id, payload) {
    validateAddMomNote(payload);
    const updated = await momNotesRepository.update(id, payload.content);
    if (!updated) throw new ApiError(404, 'Entry not found');
    return updated;
  },

  async remove(id) {
    const note = await momNotesRepository.findById(id);
    if (!note) throw new ApiError(404, 'Entry not found');
    await momNotesRepository.remove(id);
  },
};
