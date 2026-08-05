import { Teacher } from '../models/teacher.model.js';

export const teachersRepository = {
  async findBySchool(schoolId) {
    return Teacher.find({ school_id: schoolId }).sort({ created_at: -1 });
  },

  async findById(id) {
    try {
      return await Teacher.findById(id);
    } catch {
      return null; // invalid ObjectId format
    }
  },

  async create(schoolId, { name, position, subject, phone, state }) {
    return Teacher.create({ school_id: schoolId, name, position, subject, phone, state });
  },

  async remove(id) {
    await Teacher.findByIdAndDelete(id);
  },
};
