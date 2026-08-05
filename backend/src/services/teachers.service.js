import { teachersRepository } from '../repositories/teachers.repository.js';
import { assertSchoolExists } from './schools.service.js';
import { validateAddTeacher } from '../validators/teachers.validator.js';
import { ApiError } from '../utils/ApiError.js';

export const teachersService = {
  async list(schoolId) {
    await assertSchoolExists(schoolId);
    return teachersRepository.findBySchool(schoolId);
  },

  async add(schoolId, payload) {
    await assertSchoolExists(schoolId);
    validateAddTeacher(payload);
    return teachersRepository.create(schoolId, payload);
  },

  async remove(teacherId) {
    const teacher = await teachersRepository.findById(teacherId);
    if (!teacher) throw new ApiError(404, 'Teacher not found');
    return teachersRepository.remove(teacherId);
  },
};
