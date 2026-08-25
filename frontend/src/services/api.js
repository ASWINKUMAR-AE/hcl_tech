import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach JWT token automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pathfinder_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// API Call Wrapper Services
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  saveProfile: (data) => api.post('/profile', data),
};

export const skillAPI = {
  getAll: () => api.get('/skills'),
  getUserSkills: () => api.get('/skills/profile'),
  addUserSkill: (data) => api.post('/skills/profile', data),
};

export const pathAPI = {
  generate: (goal) => api.post('/learning-paths/generate', { goal }),
  getActive: () => api.get('/learning-paths'),
  updateStep: (stepId, status, progressPercentage = 100) => 
    api.put(`/learning-paths/steps/${stepId}/progress`, { status, completion_percentage: progressPercentage }),
  regenerate: () => api.post('/learning-paths/regenerate'),
};

export const recommendationAPI = {
  getRecommendations: () => api.get('/recommendations'),
  submitFeedback: (recId, data) => api.post(`/recommendations/${recId}/feedback`, data),
};

export const skillGapAPI = {
  getSkillGap: () => api.get('/skill-gap'),
};

export const aiAPI = {
  chat: (message) => api.post('/ai/chat', { message }),
  analyzeGoal: (goal) => api.post('/ai/analyze-goal', { goal }),
  explainRecommendation: (resource) => api.post('/ai/explain-recommendation', { resource }),
};

export const progressAPI = {
  getMetrics: () => api.get('/progress'),
  getSkills: () => api.get('/progress/skills'),
  getMilestones: () => api.get('/progress/milestones'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  addCourse: (data) => api.post('/admin/courses', data),
  addSkill: (data) => api.post('/admin/skills', data),
};

export default api;
