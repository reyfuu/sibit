import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
  withCredentials: true,
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authApi = {
  login: (data) =>
    api.post('/auth/login', data).then((r) => r.data),
  register: (data) =>
    api.post('/auth/register', data).then((r) => r.data),
};

// ─── Nota ─────────────────────────────────────────────────────────────────────
export const notaApi = {
  getAll: () =>
    api.get('/nota').then((r) => r.data),
  create: (data) =>
    api.post('/nota', data).then((r) => r.data),
  update: (id, data) =>
    api.put(`/nota/${id}`, data).then((r) => r.data),
};
