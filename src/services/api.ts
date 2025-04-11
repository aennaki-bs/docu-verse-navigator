
import axios from 'axios';
import { toast } from 'sonner';

// Create axios instance with default configuration
const api = axios.create({
  // Use HTTP for localhost connections to avoid SSL errors
  baseURL: import.meta.env.VITE_API_URL || 'http://192.168.1.94:5204/api',
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
        toast.error('Network error. Please check your connection and try again.', {
          description: 'Unable to connect to the server'
        });
      }
      
      return Promise.reject(error);
    }
    
    // Handle SSL errors
    if (error.message?.includes('SSL') || error.code === 'ERR_SSL_PROTOCOL_ERROR') {
      console.error('SSL error detected:', error);
      
      if (!error.config.url.includes('/Auth/login') && !error.config.url.includes('/Auth/register')) {
        toast.error('SSL connection error. Contact your administrator to configure correct API settings.');
      }
      
      return Promise.reject(error);
    }
    
    console.error('API Response Error:', error.response || error);
    
    // Extract detailed error message from response if available
    const errorMessage = getErrorMessage(error);
    
    // Only show toast for non-auth endpoints or endpoints that don't handle their own errors
    const skipToast = error.config.url.includes('/Auth/login') || 
                      error.config.url.includes('/Auth/register') ||
                      error.config.url.includes('/Auth/valide-email') ||
                      error.config.url.includes('/Auth/valide-username') ||
                      error.config.url.includes('/Auth/verify-email') ||
                      error.config.url.includes('/Account/resend-code');
                      
    if (!skipToast && errorMessage) {
      toast.error('API Error', {
        description: errorMessage
      });
    }
    
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
      toast.error('Permission Denied', {
        description: 'You do not have permission to perform this action.'
      });
      
      // If accessing admin endpoint, redirect to dashboard
      if (originalRequest.url.includes('/Admin/')) {
        window.location.href = '/dashboard';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to extract error message from various API response formats
const getErrorMessage = (error: any): string => {
  // If there's no response, it's likely a network error
  if (!error.response) {
    return error.message || 'Network error. Please try again later.';
  }

  // Get the response data
  const { data, status } = error.response;
  
  // Handle different error formats from the API
  if (typeof data === 'string') {
    return data;
  }
  
  if (data?.message) {
    return data.message;
  }
  
  if (data?.error) {
    return data.error;
  }
  
  if (data?.errors) {
    // If it's an array of errors, join them
    if (Array.isArray(data.errors)) {
      return data.errors.join('. ');
    }
    // If it's an object with error properties
    if (typeof data.errors === 'object') {
      return Object.values(data.errors).flat().join('. ');
    }
    return data.errors.toString();
  }
  
  // Return status-specific messages
  switch (status) {
    case 400:
      return 'Bad request. Please check your input.';
    case 401:
      return 'Unauthorized. Please log in again.';
    case 403:
      return 'Forbidden. You do not have permission to access this resource.';
    case 404:
      return 'Resource not found.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return `Error ${status}: ${data || 'Unknown error'}`;
  }
};

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
