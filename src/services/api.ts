import axios from 'axios';
import { User, ChatMessage } from '../types';

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
  addToHistory: (fileId: number) => api.post(`/files/${fileId}/history`),
  upload: (formData: FormData) => api.post('/files', formData),
  download: (id: number) => api.get(`/files/${id}`),
  toggleBookmark: (id: number) => api.put(`/files/${id}/bookmark`),
  incrementRecommendations: (id: number) => api.put(`/files/${id}/recommend`),
  incrementAccessCount: (fileId: number) => api.post(`/files/${fileId}/access-count`),
};

export const user = {
  get: () => api.get('/api/user'),
  update: (user: User) => api.put('/api/user', user),   
  updateSettings: (settings: Partial<User['settings']>) => api.put('/api/user/settings', settings),
}; 

export const chat = {
  addMessage: (message: ChatMessage) => api.post('/api/chat/messages', message),
}; 

export default api;