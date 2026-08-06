import { Teacher } from '../models/teacher.model.js';

export const teachersRepository = {
  async findByParent(parentType, parentId) {
    return Teacher.find({ parent_type: parentType, parent_id: parentId }).sort({ created_at: -1 });
  },

  async findById(id) {
    try {
      return await Teacher.findById(id);
    } catch {
      return null; // invalid ObjectId format
    }
  },

  async create(parentType, parentId, { name, position, subject, phone, state }) {
    return Teacher.create({ parent_type: parentType, parent_id: parentId, name, position, subject, phone, state });
  },

  async remove(id) {
    await Teacher.findByIdAndDelete(id);
  },
};
