import axios from 'axios';
import { User, ChatMessage, PageRequest, PageResponse, FileType, RecommendationResponse } from '../types';

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
  getAll: (pageRequest: PageRequest) => 
    api.get<PageResponse<FileType>>('/files', { params: pageRequest }),
  getHistory: () => api.get('/files/history'),
  getBookmarks: () => api.get('/files/bookmarks'),
  getRecommendations: () => 
    api.get<RecommendationResponse[]>('/recommendations'),
  upload: (formData: FormData) => api.post('/files', formData),
  addBookmark: (fileId: number) => api.post(`/files/${fileId}/bookmark`),
  removeBookmark: (fileId: number) => api.delete(`/files/${fileId}/bookmark`),
  incrementRecommendations: (fileId: number) => api.put(`/files/${fileId}/recommend`),
  watch: (fileId: number) => api.post(`/files/${fileId}/watch`),
  getRecommendedFiles: (fileId: number) => api.get(`/files/${fileId}/recommended`),
  addTag: (fileId: number, tag: string) => 
    api.post(`/files/${fileId}/tags`, { tag }),
  removeTag: (fileId: number, tag: string) => 
    api.delete(`/files/${fileId}/tags/${tag}`),
  getAllTags: () => 
    api.get<string[]>('/files/tags'),
  getFilesByTag: (tag: string) => 
    api.get<FileType[]>(`/files/tags/${tag}`),
  deleteWatchHistory: (fileId: number) => 
    api.delete(`/watch-history/${fileId}`),
  clearWatchHistory: () => 
    api.delete('/watch-history'),
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