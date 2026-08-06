import { Alumni } from '../models/alumni.model.js';

export const alumniRepository = {
  async findAll() {
    return Alumni.find().sort({ created_at: -1 });
  },

  async findById(id) {
    try {
      return await Alumni.findById(id);
    } catch {
      return null; // invalid ObjectId format
    }
  },

  async create({ school_name, pic_name, type }) {
    return Alumni.create({ school_name, pic_name, type });
  },

  async update(id, updates) {
    return Alumni.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  },

  async remove(id) {
    await Alumni.findByIdAndDelete(id);
  },
};
