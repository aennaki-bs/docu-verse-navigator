
import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with default configuration
const api = axios.create({
  // Use a more flexible base URL approach - try HTTPS first, then fallback to HTTP
  baseURL: import.meta.env.VITE_API_URL || 'https://localhost:5204/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Add reasonable timeout to prevent hanging requests
  timeout: 15000, // 15 seconds timeout
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
    
    // Show loading toast for long operations
    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      const requestId = Date.now().toString();
      // @ts-ignore - Add a custom property to the config
      config.requestId = requestId;
      
      // For sensitive operations like login, don't show the toast
      if (!config.url?.includes('/Auth/login') && !config.url?.includes('/Auth/register')) {
        toast.loading('Processing request...', { id: requestId });
      }
    }
    
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
    
    // Dismiss loading toast if it exists
    // @ts-ignore - Access the custom property from the config
    if (response.config.requestId) {
      // @ts-ignore
      toast.dismiss(response.config.requestId);
    }
    
    return response;
  },
  async (error) => {
    // Dismiss loading toast if it exists
    // @ts-ignore - Access the custom property from the config
    if (error.config?.requestId) {
      // @ts-ignore
      toast.dismiss(error.config.requestId);
    }
    
    // Network errors (no connection to server)
    if (error.code === 'ERR_NETWORK') {
      console.error('Network error detected:', error);
      
      // Don't show error toast for login/register as they handle errors themselves
      if (!error.config.url.includes('/Auth/login') && !error.config.url.includes('/Auth/register')) {
        toast.error('Network error. Please check your connection and try again.');
      }
      
      return Promise.reject(error);
    }
    
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

// Simple method to test if API is available
// Try to make a basic request to the server without assuming a specific endpoint
export const checkApiConnection = async () => {
  try {
    // Try to access the base API URL - this doesn't need to hit a specific endpoint
    // The connection will fail early if the server is completely unreachable
    await api.get('', { 
      timeout: 5000,
      // Don't throw for 404 errors - we just want to check if the server responds at all
      validateStatus: (status) => status < 500
    });
    return true;
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
};

export default api;
