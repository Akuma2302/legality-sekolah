import bcrypt from 'bcryptjs';
import { usersRepository } from '../repositories/users.repository.js';
import { signToken } from '../utils/jwt.js';
import { validateSignup, validateSignin } from '../validators/auth.validator.js';
import { ApiError } from '../utils/ApiError.js';

const SALT_ROUNDS = 10;

export const authService = {
  async signup(payload) {
    validateSignup(payload);
    const { email, password, full_name } = payload;

    const existing = await usersRepository.findByEmail(email);
    if (existing) throw new ApiError(409, 'An account with this email already exists');

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await usersRepository.create({ email, password_hash, full_name });

    return { token: signToken(user.id), user: toPublicUser(user) };
  },

  async signin(payload) {
    validateSignin(payload);
    const { email, password } = payload;

    const user = await usersRepository.findByEmail(email);
    if (!user) throw new ApiError(401, 'Invalid email or password');

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) throw new ApiError(401, 'Invalid email or password');

    return { token: signToken(user.id), user: toPublicUser(user) };
  },

  async me(user) {
    const record = await usersRepository.findById(user.id);
    if (!record) throw new ApiError(404, 'Account not found');
    return toPublicUser(record);
  },
};

function toPublicUser(user) {
  return { id: user.id, email: user.email, full_name: user.full_name, role: user.role };
}
