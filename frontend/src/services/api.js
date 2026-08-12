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
  // Auth — sign-in only, no public signup
  signin: (payload) => request('/api/auth/signin', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/api/auth/me'),

  // Schools — public, no login required (except legality status below)
  getSchools: () => request('/api/schools'),
  createSchool: (payload) => request('/api/schools', { method: 'POST', body: JSON.stringify(payload) }),
  getSchool: (id) => request(`/api/schools/${id}`),
  updateSchool: (id, payload) => request(`/api/schools/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteSchool: (id) => request(`/api/schools/${id}`, { method: 'DELETE' }),

  // Admin only — requires an admin login token
  updateLegalityStatus: (id, legality_status) =>
    request(`/api/schools/${id}/legality-status`, {
      method: 'PATCH',
      body: JSON.stringify({ legality_status }),
    }),

  // Alumni — public, same shape as schools but no admin-only field
  getAlumni: () => request('/api/alumni'),
  createAlumnus: (payload) => request('/api/alumni', { method: 'POST', body: JSON.stringify(payload) }),
  getAlumnus: (id) => request(`/api/alumni/${id}`),
  updateAlumnus: (id, payload) => request(`/api/alumni/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteAlumnus: (id) => request(`/api/alumni/${id}`, { method: 'DELETE' }),

  // Random — public, same shape as alumni
  getRandomEntries: () => request('/api/random'),
  createRandomEntry: (payload) => request('/api/random', { method: 'POST', body: JSON.stringify(payload) }),
  getRandomEntry: (id) => request(`/api/random/${id}`),
  updateRandomEntry: (id, payload) => request(`/api/random/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteRandomEntry: (id) => request(`/api/random/${id}`, { method: 'DELETE' }),

  // Teachers — shared by schools, alumni and random entries; parentType is 'school' | 'alumni' | 'random'
  getTeachers: (parentType, parentId) => request(`/api/teachers/${parentType}/${parentId}`),
  addTeacher: (parentType, parentId, payload) =>
    request(`/api/teachers/${parentType}/${parentId}`, { method: 'POST', body: JSON.stringify(payload) }),
  deleteTeacher: (id) => request(`/api/teachers/${id}`, { method: 'DELETE' }),

  // MOM notes — shared by schools, alumni and random entries
  getMomNotes: (parentType, parentId) => request(`/api/mom-notes/${parentType}/${parentId}`),
  addMomNote: (parentType, parentId, content) =>
    request(`/api/mom-notes/${parentType}/${parentId}`, { method: 'POST', body: JSON.stringify({ content }) }),
  updateMomNote: (id, content) =>
    request(`/api/mom-notes/${id}`, { method: 'PUT', body: JSON.stringify({ content }) }),
  deleteMomNote: (id) => request(`/api/mom-notes/${id}`, { method: 'DELETE' }),
};
