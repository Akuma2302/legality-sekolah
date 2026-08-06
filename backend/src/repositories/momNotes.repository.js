import { MomNote } from '../models/momNote.model.js';

export const momNotesRepository = {
  async findByParent(parentType, parentId) {
    return MomNote.find({ parent_type: parentType, parent_id: parentId }).sort({ created_at: -1 });
  },

  async create(parentType, parentId, content) {
    return MomNote.create({ parent_type: parentType, parent_id: parentId, content });
  },
};
