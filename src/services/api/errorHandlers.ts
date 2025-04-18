
import { toast } from 'sonner';

// Helper function to extract error message from various API response formats
export const getErrorMessage = (error: any): string => {
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

// Function to handle error response
export const handleErrorResponse = (error: any, skipToast: boolean = false): Promise<never> => {
  // Extract detailed error message from response if available
  const errorMessage = getErrorMessage(error);
  
  // Only show toast for endpoints that don't handle their own errors
  if (!skipToast && errorMessage) {
    toast.error('API Error', {
      description: errorMessage
    });
  }
  
  return Promise.reject(error);
};

// Check if endpoint should skip authentication redirect
export const shouldSkipAuthRedirect = (url: string): boolean => {
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
  
  return noRedirectEndpoints.some(endpoint => url.includes(endpoint));
};

// Check if endpoint should skip error toast
export const shouldSkipErrorToast = (url: string): boolean => {
  return url.includes('/Auth/login') || 
         url.includes('/Auth/register') ||
         url.includes('/Auth/valide-email') ||
         url.includes('/Auth/valide-username') ||
         url.includes('/Auth/verify-email') ||
         url.includes('/Account/resend-code');
};
