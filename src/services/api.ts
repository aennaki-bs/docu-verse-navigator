
import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'http://localhost:5204/api', // Local development server URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If the error is 401 and hasn't already been retried
    if (error.response.status === 401 && !originalRequest._retry) {
      // Handle token refresh or logout here
      // For this initial implementation, we'll just clear the token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
