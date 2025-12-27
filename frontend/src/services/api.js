import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import Constants from 'expo-constants';

// Get API URL from app.json extra config
// const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000/api';
// const SOCKET_URL = Constants.expoConfig?.extra?.socketUrl || 'http://localhost:5000';


import { API_URL, SOCKET_URL } from "../config/api";


// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting auth token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/me"),

  // FIX: Explicitly set multipart/form-data for file uploads
  updateProfile: (data) =>
    api.put("/auth/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: (data, headers) => {
        return data; // STOP Axios from stringifying the FormData
      },
    }),

  logout: () => api.post("/auth/logout"),
};

// ... (Keep the rest of your API objects: incidentsAPI, volunteersAPI, etc.)

export const incidentsAPI = {
  create: (data) => api.post("/incidents", data),
  getAll: (params) => api.get("/incidents", { params }),
  getNearby: (params) => api.get("/incidents/nearby", { params }),
  getById: (id) => api.get(`/incidents/${id}`),
  updateStatus: (id, data) => api.patch(`/incidents/${id}/status`, data),
  resolveIncident: (id, data) => api.post(`/incidents/${id}/resolve`, data),
  acceptTask: (id) => api.post(`/incidents/${id}/accept`),
  assignVolunteer: (id, data) => api.post(`/incidents/${id}/assign`, data),
};

export const volunteersAPI = {
  register: (data) => api.post("/volunteers/register", data),
  updateProfile: (data) => api.patch("/volunteers/profile", data),
  getNearby: (params) => api.get("/volunteers/nearby", { params }),
  acceptTask: (data) => api.post("/volunteers/accept-task", data),
  completeTask: (data) => api.post("/volunteers/complete-task", data),
  getLeaderboard: (params) => api.get("/volunteers/leaderboard", { params }),
  getStats: () => api.get("/volunteers/stats"),
};

export const petsAPI = {
  create: (data) => api.post("/pets", data),
  getAll: (params) => api.get("/pets", { params }),
  getById: (id) => api.get(`/pets/${id}`),
  expressInterest: (id, data) => api.post(`/pets/${id}/interest`, data),
  reportLostFound: (data) => api.post("/pets/report-lost-found", data),
  getLostFound: (params) => api.get("/pets/lost-found", { params }),
};

export const marketplaceAPI = {
  registerService: (data) => api.post("/marketplace/services", data),
  getServices: (params) => api.get("/marketplace/services", { params }),
  getMyServices: () => api.get("/marketplace/my"),
  getNearbyServices: (params) => api.get("/marketplace/services/nearby", { params }),
  getServiceById: (id) => api.get(`/marketplace/services/${id}`),
  addReview: (id, data) => api.post(`/marketplace/services/${id}/review`, data),
  updateService: (id, data) => api.patch(`/marketplace/services/${id}`, data),
};

export default api;