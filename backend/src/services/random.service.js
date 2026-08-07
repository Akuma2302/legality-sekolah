import { randomRepository } from '../repositories/random.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { EDITABLE_RANDOM_FIELDS } from '../models/random.model.js';
import { validateCreateRandom } from '../validators/random.validator.js';

export async function assertRandomExists(id) {
  const entry = await randomRepository.findById(id);
  if (!entry) throw new ApiError(404, 'Random entry not found');
  return entry;
}

export const randomService = {
  list: () => randomRepository.findAll(),

  async create(payload) {
    validateCreateRandom(payload);
    const { school_name, pic_name, type } = payload;
    return randomRepository.create({ school_name, pic_name, type });
  },

  async getById(id) {
    return assertRandomExists(id);
  },

  async update(id, payload) {
    await assertRandomExists(id);
    const updates = {};
    for (const field of EDITABLE_RANDOM_FIELDS) {
      if (payload[field] !== undefined) updates[field] = payload[field];
    }
    return randomRepository.update(id, updates);
  },

  async remove(id) {
    await assertRandomExists(id);
    return randomRepository.remove(id);
  },
};