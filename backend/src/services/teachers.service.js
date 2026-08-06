import { teachersRepository } from '../repositories/teachers.repository.js';
import { assertParentExists } from '../utils/parentResolver.js';
import { validateAddTeacher } from '../validators/teachers.validator.js';
import { ApiError } from '../utils/ApiError.js';

export const teachersService = {
  async list(parentType, parentId) {
    const { refName } = await assertParentExists(parentType, parentId);
    return teachersRepository.findByParent(refName, parentId);
  },

  async add(parentType, parentId, payload) {
    const { refName } = await assertParentExists(parentType, parentId);
    validateAddTeacher(payload);
    return teachersRepository.create(refName, parentId, payload);
  },

  async remove(teacherId) {
    const teacher = await teachersRepository.findById(teacherId);
    if (!teacher) throw new ApiError(404, 'Teacher not found');
    return teachersRepository.remove(teacherId);
  },
};
