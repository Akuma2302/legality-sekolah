import { MomNote } from '../models/momNote.model.js';

export const momNotesRepository = {
  async findByParent(parentType, parentId) {
    return MomNote.find({ parent_type: parentType, parent_id: parentId }).sort({ created_at: -1 });
  },

  async findById(id) {
    try {
      return await MomNote.findById(id);
    } catch {
      return null; // invalid ObjectId format
    }
  },

  async create(parentType, parentId, content) {
    return MomNote.create({ parent_type: parentType, parent_id: parentId, content });
  },

  async update(id, content) {
    return MomNote.findByIdAndUpdate(id, { content }, { new: true, runValidators: true });
  },

  async remove(id) {
    await MomNote.findByIdAndDelete(id);
  },

  /** Returns { [parent_id]: latestCreatedAt } for every parent of this type that has at least one entry. */
  async findLatestByParentType(parentType) {
    const rows = await MomNote.aggregate([
      { $match: { parent_type: parentType } },
      { $group: { _id: '$parent_id', latest: { $max: '$created_at' } } },
    ]);
    const map = {};
    for (const row of rows) map[row._id.toString()] = row.latest;
    return map;
  },
};
