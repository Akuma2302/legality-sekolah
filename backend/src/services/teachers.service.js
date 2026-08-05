import { teachersRepository } from '../repositories/teachers.repository.js';
import { assertSchoolAccess } from './schools.service.js';
import { validateAddTeacher } from '../validators/teachers.validator.js';
import { ApiError } from '../utils/ApiError.js';

export const teachersService = {
  async list(user, schoolId) {
    await assertSchoolAccess(schoolId, user);
    return teachersRepository.findBySchool(schoolId);
  },

  async add(user, schoolId, payload) {
    await assertSchoolAccess(schoolId, user);
    validateAddTeacher(payload);
    return teachersRepository.create(schoolId, payload);
  },

  async remove(user, teacherId) {
    const teacher = await teachersRepository.findById(teacherId);
    if (!teacher) throw new ApiError(404, 'Teacher not found');
    await assertSchoolAccess(teacher.school_id, user);
    return teachersRepository.remove(teacherId);
  },
};
