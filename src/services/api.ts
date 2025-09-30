import axios from 'axios';
import { STORAGE_KEYS, API_ENDPOINTS } from '../constants';

// Create axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Include cookies in requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API endpoints
export const authAPI = {
  signup: async (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    const response = await api.post(API_ENDPOINTS.SIGNUP, userData);
    return response.data;
  },

  signin: async (credentials: { email: string; password: string }) => {
    const response = await api.post(API_ENDPOINTS.SIGNIN, credentials);
    return response.data;
  },

  logout: async () => {
    const response = await api.post(API_ENDPOINTS.LOGOUT);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.PROFILE);
    return response.data;
  },

  // OAuth endpoints
  googleLogin: () => {
    window.location.href = `${api.defaults.baseURL}${API_ENDPOINTS.GOOGLE_OAUTH}`;
  },

  githubLogin: () => {
    window.location.href = `${api.defaults.baseURL}${API_ENDPOINTS.GITHUB_OAUTH}`;
  },
};

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export default api;