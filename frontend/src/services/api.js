<<<<<<< HEAD
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get API URL from app.json extra config
const API_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:5000/api';
const SOCKET_URL = Constants.expoConfig?.extra?.socketUrl || 'http://localhost:5000';
=======
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// // API Base URL - Change this based on your environment
// const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// // Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   timeout: 30000,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   async (config) => {
//     try {
//       const token = await AsyncStorage.getItem('authToken');
//       console.log('Token from storage:', token ? 'Token exists' : 'No token');
//       if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//         console.log('Authorization header set');
//       } else {
//         console.warn('No auth token found in storage');
//       }
//     } catch (error) {
//       console.error('Error getting auth token:', error);
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Token expired or invalid
//       await AsyncStorage.removeItem('authToken');
//       await AsyncStorage.removeItem('user');
//       // You can emit an event here to redirect to login
//     }
    
//     return Promise.reject(error);
//   }
// );

// // Auth API
// export const authAPI = {
//   register: (data) => api.post('/auth/register', data),
//   login: (data) => api.post('/auth/login', data),
//   getProfile: () => api.get('/auth/me'),
//   updateProfile: (data) => api.put('/auth/profile', data),
//   logout: () => api.post('/auth/logout'),
// };

// // Incidents API
// export const incidentsAPI = {
//   create: (data) => api.post('/incidents', data),
//   getAll: (params) => api.get('/incidents', { params }),
//   getNearby: (params) => api.get('/incidents/nearby', { params }),
//   getById: (id) => api.get(`/incidents/${id}`),
//   updateStatus: (id, data) => api.patch(`/incidents/${id}/status`, data),
//   assignVolunteer: (id, data) => api.post(`/incidents/${id}/assign`, data),
// };

// // Volunteers API
// export const volunteersAPI = {
//   register: (data) => api.post('/volunteers/register', data),
//   updateProfile: (data) => api.patch('/volunteers/profile', data),
//   getNearby: (params) => api.get('/volunteers/nearby', { params }),
//   acceptTask: (data) => api.post('/volunteers/accept-task', data),
//   completeTask: (data) => api.post('/volunteers/complete-task', data),
//   getLeaderboard: (params) => api.get('/volunteers/leaderboard', { params }),
//   getStats: () => api.get('/volunteers/stats'),
// };

// // Pets API
// export const petsAPI = {
//   create: (data) => api.post('/pets', data),
//   getAll: (params) => api.get('/pets', { params }),
//   getById: (id) => api.get(`/pets/${id}`),
//   expressInterest: (id, data) => api.post(`/pets/${id}/interest`, data),
//   reportLostFound: (data) => api.post('/pets/report-lost-found', data),
//   getLostFound: (params) => api.get('/pets/lost-found', { params }),
// };

// // Marketplace API
// export const marketplaceAPI = {
//   registerService: (data) => api.post('/marketplace/services', data),
//   getServices: (params) => api.get('/marketplace/services', { params }),
//   getNearbyServices: (params) => api.get('/marketplace/services/nearby', { params }),
//   getServiceById: (id) => api.get(`/marketplace/services/${id}`),
//   addReview: (id, data) => api.post(`/marketplace/services/${id}/review`, data),
//   updateService: (id, data) => api.patch(`/marketplace/services/${id}`, data),
// };

// export default api;


import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// API Base URL - Change this based on your environment
const API_URL = process.env.API_URL || "http://localhost:5000/api"; // Use your actual IP if on device!
>>>>>>> f91502489682d61c344dd413fea6f472d0275032

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
  getNearbyServices: (params) => api.get("/marketplace/services/nearby", { params }),
  getServiceById: (id) => api.get(`/marketplace/services/${id}`),
  addReview: (id, data) => api.post(`/marketplace/services/${id}/review`, data),
  updateService: (id, data) => api.patch(`/marketplace/services/${id}`, data),
};

export default api;