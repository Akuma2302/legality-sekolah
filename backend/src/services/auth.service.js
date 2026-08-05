import bcrypt from 'bcryptjs';
import { usersRepository } from '../repositories/users.repository.js';
import { signToken } from '../utils/jwt.js';
import { validateSignin } from '../validators/auth.validator.js';
import { ApiError } from '../utils/ApiError.js';

export const authService = {
  async signin(payload) {
    validateSignin(payload);
    const { username, password } = payload;

    const user = await usersRepository.findByUsername(username);
    if (!user) throw new ApiError(401, 'Invalid username or password');

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) throw new ApiError(401, 'Invalid username or password');

    return { token: signToken(user.id), user: toPublicUser(user) };
  },

  async me(user) {
    const record = await usersRepository.findById(user.id);
    if (!record) throw new ApiError(404, 'Account not found');
    return toPublicUser(record);
  },
};

function toPublicUser(user) {
  return { id: user.id, username: user.username, full_name: user.full_name, role: user.role };
}
