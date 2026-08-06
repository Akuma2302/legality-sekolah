import { schoolsRepository } from '../repositories/schools.repository.js';
import { alumniRepository } from '../repositories/alumni.repository.js';
import { ApiError } from './ApiError.js';

const PARENT_TYPES = {
  school: { refName: 'School', repo: schoolsRepository },
  alumni: { refName: 'Alumni', repo: alumniRepository },
};

/** Turns the URL segment ("school"/"alumni") into { refName, repo }, or throws 400. */
export function resolveParentType(rawType) {
  const entry = PARENT_TYPES[rawType?.toLowerCase()];
  if (!entry) throw new ApiError(400, 'parent type must be "school" or "alumni"');
  return entry;
}

/** Confirms the parent (school or alumni entry) actually exists before attaching a teacher/MOM note to it. */
export async function assertParentExists(rawType, parentId) {
  const { refName, repo } = resolveParentType(rawType);
  const parent = await repo.findById(parentId);
  if (!parent) throw new ApiError(404, `${refName} not found`);
  return { refName, parent };
}
