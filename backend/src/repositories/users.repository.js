import { User } from '../models/user.model.js';

export const usersRepository = {
  async findByUsername(username) {
    return User.findOne({ username: username.toLowerCase().trim() });
  },

  async findById(id) {
    try {
      return await User.findById(id);
    } catch {
      return null; // invalid ObjectId format
    }
  },

  /** Only used by scripts/seedAdmin.js — there's no public signup endpoint. */
  async upsertAdmin({ username, password_hash, full_name }) {
    return User.findOneAndUpdate(
      { username: username.toLowerCase().trim() },
      { username: username.toLowerCase().trim(), password_hash, full_name, role: 'admin' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  },
};
