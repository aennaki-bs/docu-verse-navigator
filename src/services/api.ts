
import axios from 'axios';
import { toast } from 'sonner';

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
    
    // Only redirect to login for auth-required endpoints when token is invalid
    // Specifically exclude non-authenticated endpoints from auto-redirecting
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Don't redirect for these specific endpoints
      const noRedirectEndpoints = [
        '/Auth/login', 
        '/Auth/register',
        '/Account/forgot-password',
        '/Account/update-password',
        '/Account/resend-code',
        '/Auth/verify-email',
        '/Auth/valide-email', 
        '/Auth/valide-username'
      ];
      
      // If it's not one of the exceptions and is a 401, only then redirect
      const shouldRedirect = !noRedirectEndpoints.some(endpoint => 
        originalRequest.url.includes(endpoint)
      );
      
      if (shouldRedirect) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Handle 403 Forbidden errors (e.g., accessing admin endpoints without permission)
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
      
      // If accessing admin endpoint, redirect to dashboard
      if (originalRequest.url.includes('/Admin/')) {
        window.location.href = '/dashboard';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
