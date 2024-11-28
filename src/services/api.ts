import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }),
  signup: (username: string, email: string, password: string) =>
    api.post('/auth/signup', { username, email, password }),
};

export const files = {
  getAll: () => api.get('/files'),
  upload: (formData: FormData) => api.post('/files', formData),
  download: (id: number) => api.get(`/files/${id}`),
  toggleBookmark: (id: number) => api.put(`/files/${id}/bookmark`),
  incrementRecommendations: (id: number) => api.put(`/files/${id}/recommend`),
};

export default api;