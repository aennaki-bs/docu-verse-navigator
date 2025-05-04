import { toast } from 'sonner';
import api from './core';
import axios from 'axios';
import { handleErrorResponse, shouldSkipAuthRedirect, shouldSkipErrorToast } from './errorHandlers';

// Check if we're in a browser environment
const isBrowserEnvironment = () => typeof window !== 'undefined' && typeof localStorage !== 'undefined';

// Track if we already have a pending auth redirect to prevent multiple redirects
let pendingAuthRedirect = false;

// Request throttling to prevent excessive API calls
const requestThrottleMap = new Map<string, number>();
const THROTTLE_TIME_MS = 1000; // 1 second minimum between identical requests

// Request interceptor for API calls
const setupRequestInterceptor = () => {
  api.interceptors.request.use(
    (config) => {
      // Ensure we're in a browser environment
      if (!isBrowserEnvironment()) {
        console.warn('Running in a non-browser environment, skipping auth headers');
        return config;
      }

      // Implement request throttling for GET requests
      if (config.method?.toLowerCase() === 'get' && config.url) {
        const requestKey = `${config.method}-${config.url}`;
        const lastRequestTime = requestThrottleMap.get(requestKey) || 0;
        const now = Date.now();
        
        // If the same request was made too recently, cancel it
        if (now - lastRequestTime < THROTTLE_TIME_MS) {
          console.log(`Throttling request to: ${config.url} (too many requests)`);
          // Return a canceled request using axios CancelToken
          const source = axios.CancelToken.source();
          source.cancel(`Request to ${config.url} was throttled to prevent excessive API calls`);
          config.cancelToken = source.token;
          return config;
        }
        
        // Update the last request time
        requestThrottleMap.set(requestKey, now);
      }

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
};

// Response interceptor for API calls
const setupResponseInterceptor = () => {
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
      // If request was canceled due to throttling, just return a resolved promise
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
        return Promise.resolve({ data: null, status: 200, statusText: 'Throttled' });
      }
      
      // Ensure we're in a browser environment before accessing localStorage
      const isBrowser = isBrowserEnvironment();
      
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
      
      // Skip toast for endpoints that handle their own errors
      const skipToast = shouldSkipErrorToast(error.config.url);
                      
      const originalRequest = error.config;
      
      // Only redirect to login for auth-required endpoints when token is invalid
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        // If it's not one of the exceptions and is a 401, only then redirect
        const shouldRedirect = !shouldSkipAuthRedirect(originalRequest.url) && !pendingAuthRedirect;
        
        if (shouldRedirect && isBrowser) {
          try {
            // Set pending flag to prevent multiple redirects
            pendingAuthRedirect = true;
            
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            
            // Instead of directly redirecting, dispatch a custom event to handle this at the app level
            const authEvent = new CustomEvent('auth:expired', { 
              detail: { message: 'Authentication token has expired' } 
            });
            window.dispatchEvent(authEvent);
            
            // Only redirect if we're not already on the login page
            if (!window.location.pathname.includes('/login')) {
              // Use setTimeout to prevent immediate redirect
              setTimeout(() => {
                window.location.href = '/login';
                // Reset the flag after redirect
                pendingAuthRedirect = false;
              }, 100);
            } else {
              pendingAuthRedirect = false;
            }
          } catch (err) {
            console.error('Error during auth redirect:', err);
            pendingAuthRedirect = false;
          }
        }
      }
      
      // Handle 403 Forbidden errors (e.g., accessing admin endpoints without permission)
      if (error.response?.status === 403 && isBrowser) {
        toast.error('Permission Denied', {
          description: 'You do not have permission to perform this action.'
        });
        
        // If accessing admin endpoint, redirect to dashboard
        if (originalRequest.url.includes('/Admin/')) {
          window.location.href = '/dashboard';
        }
      }
      
      return handleErrorResponse(error, skipToast);
    }
  );
};

// Clean up throttle map every minute to prevent memory leaks
if (isBrowserEnvironment()) {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamp] of requestThrottleMap.entries()) {
      if (now - timestamp > 60000) { // Remove entries older than 1 minute
        requestThrottleMap.delete(key);
      }
    }
  }, 60000);
}

export const setupInterceptors = () => {
  setupRequestInterceptor();
  setupResponseInterceptor();
};

// Setup a listener for auth:expired events to handle token expiration
if (isBrowserEnvironment()) {
  window.addEventListener('auth:expired', (event) => {
    console.log('Auth expired event detected:', event);
    // Additional auth expiration handling if needed
  });
}
