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
  getHistory: () => api.get(`/files/history`),
  getBookmarks: () => api.get(`/files/bookmarks`),
  upload: (formData: FormData) => api.post('/files', formData),
  download: (fileId: number) => api.get(`/files/${fileId}`),
  addBookmark: (fileId: number) => api.post(`/files/${fileId}/bookmark`),
  removeBookmark: (fileId: number) => api.delete(`/files/${fileId}/bookmark`),
  incrementRecommendations: (fileId: number) => api.put(`/files/${fileId}/recommend`),
  watch: (fileId: number) => api.post(`/files/${fileId}/watch`),
  getFileDetail: (fileId: number) => api.get(`/files/${fileId}`),
  getRecommendedFiles: (fileId: number) => api.get(`/files/${fileId}/recommended`),
};

export const user = {
  get: () => api.get('/user'),
  update: (user: User) => api.put('/user', user),   
  updateSetting: (setting: Partial<User['setting']>) => api.put('/user/setting', setting),
}; 

export const chat = {
  addMessage: (message: ChatMessage) => api.post('/chat/messages', message),
}; 

export default api;