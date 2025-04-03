
import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: 'http://192.168.1.94:5204/api', // Updated to match the URL in the screenshot
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add CORS headers to help prevent CORS issues
api.defaults.headers.common['Access-Control-Allow-Origin'] = '*';

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('API Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    console.error('API Response Error:', error.response || error);
    
    const originalRequest = error.config;
    
    // If the error is 401 and hasn't already been retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If the request is not a login attempt, redirect to login
      if (!originalRequest.url.includes('/Auth/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
