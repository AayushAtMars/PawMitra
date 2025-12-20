import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const incidentsAPI = {
  getAll: (params) => api.get('/incidents', { params }),
  getById: (id) => api.get(`/incidents/${id}`),
  update: (id, data) => api.patch(`/incidents/${id}`, data),
  delete: (id) => api.delete(`/incidents/${id}`),
  getStats: () => api.get('/incidents/stats'),
};

export const petsAPI = {
  getAll: (params) => api.get('/pets', { params }),
  getById: (id) => api.get(`/pets/${id}`),
  update: (id, data) => api.patch(`/pets/${id}`, data),
  delete: (id) => api.delete(`/pets/${id}`),
  getStats: () => api.get('/pets/stats'),
};

export const volunteersAPI = {
  getAll: (params) => api.get('/volunteers', { params }),
  getStats: () => api.get('/volunteers/stats'),
  getLeaderboard: (params) => api.get('/volunteers/leaderboard', { params }),
};

export const marketplaceAPI = {
  getAll: (params) => api.get('/marketplace/services', { params }),
  getById: (id) => api.get(`/marketplace/services/${id}`),
  update: (id, data) => api.patch(`/marketplace/services/${id}`, data),
  delete: (id) => api.delete(`/marketplace/services/${id}`),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

export default api;
