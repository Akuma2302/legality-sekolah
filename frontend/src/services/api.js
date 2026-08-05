import { authToken } from './authToken';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function authHeaders() {
  const token = authToken.get();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers || {}) },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  // Auth
  signup: (payload) => request('/api/auth/signup', { method: 'POST', body: JSON.stringify(payload) }),
  signin: (payload) => request('/api/auth/signin', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/api/auth/me'),

  // Schools — user
  getMySchools: () => request('/api/schools/mine'),
  createSchool: (payload) => request('/api/schools', { method: 'POST', body: JSON.stringify(payload) }),
  getSchool: (id) => request(`/api/schools/${id}`),
  updateSchool: (id, payload) => request(`/api/schools/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteSchool: (id) => request(`/api/schools/${id}`, { method: 'DELETE' }),

  // Schools — admin
  getAllSchools: () => request('/api/schools'),
  updateLegalityStatus: (id, legality_status) =>
    request(`/api/schools/${id}/legality-status`, {
      method: 'PATCH',
      body: JSON.stringify({ legality_status }),
    }),

  // Teachers
  getTeachers: (schoolId) => request(`/api/teachers/school/${schoolId}`),
  addTeacher: (schoolId, payload) =>
    request(`/api/teachers/school/${schoolId}`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteTeacher: (id) => request(`/api/teachers/${id}`, { method: 'DELETE' }),

  // MOM notes
  getMomNotes: (schoolId) => request(`/api/mom-notes/school/${schoolId}`),
  addMomNote: (schoolId, content) =>
    request(`/api/mom-notes/school/${schoolId}`, { method: 'POST', body: JSON.stringify({ content }) }),
};
