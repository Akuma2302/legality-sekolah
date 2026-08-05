import { MomNote } from '../models/momNote.model.js';

export const momNotesRepository = {
  async findBySchool(schoolId) {
    return MomNote.find({ school_id: schoolId }).sort({ created_at: -1 });
  },

  async create(schoolId, content) {
    return MomNote.create({ school_id: schoolId, content });
  },
};
