import { School } from '../models/school.model.js';

export const schoolsRepository = {
  async findAll() {
    return School.find().sort({ created_at: -1 });
  },

  async findById(id) {
    try {
      return await School.findById(id);
    } catch {
      return null; // invalid ObjectId format
    }
  },

  async create({ school_name, pic_name, type }) {
    return School.create({ school_name, pic_name, type });
  },

  async update(id, updates) {
    return School.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  },

  async remove(id) {
    await School.findByIdAndDelete(id);
  },
};
