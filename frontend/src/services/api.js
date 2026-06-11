import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({ baseURL: BASE });

api.interceptors.request.use(config => {
  const token = localStorage.getItem('careerpilot_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('careerpilot_token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  profile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const resumeAPI = {
  analyze: (formData) => api.post('/resume/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  history: () => api.get('/resume/history'),
  getById: (id) => api.get(`/resume/${id}`),
};

export const interviewAPI = {
  generate: (data) => api.post('/interview/generate', data),
  history: () => api.get('/interview/history'),
  getById: (id) => api.get(`/interview/${id}`),
};

export const hrAPI = {
  generate: (data) => api.post('/hr/generate', data),
  history: () => api.get('/hr/history'),
};

export const roadmapAPI = {
  generate: (data) => api.post('/roadmap/generate', data),
  history: () => api.get('/roadmap/history'),
  getById: (id) => api.get(`/roadmap/${id}`),
};

export const dashboardAPI = {
  stats: () => api.get('/dashboard/stats'),
};

export default api;
