import { Random } from '../models/random.model.js';

export const randomRepository = {
  async findAll() {
    return Random.find().sort({ created_at: -1 });
  },

  async findById(id) {
    try {
      return await Random.findById(id);
    } catch {
      return null; // invalid ObjectId format
    }
  },

  async create({ school_name, pic_name, type }) {
    return Random.create({ school_name, pic_name, type });
  },

  async update(id, updates) {
    return Random.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
  },

  async remove(id) {
    await Random.findByIdAndDelete(id);
  },
};
