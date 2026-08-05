import { User } from '../models/user.model.js';

export const usersRepository = {
  async findByEmail(email) {
    return User.findOne({ email: email.toLowerCase().trim() });
  },

  async findById(id) {
    try {
      return await User.findById(id);
    } catch {
      return null; // invalid ObjectId format
    }
  },

  async create({ email, password_hash, full_name }) {
    return User.create({ email, password_hash, full_name, role: 'user' });
  },
};
