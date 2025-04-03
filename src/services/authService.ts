
import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  passwordHash: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  username?: string;
  adminSecretKey?: string;
}

export interface UserInfo {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  profilePicture?: string;
}

export interface AuthResponse {
  token: string;
  user: UserInfo;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/Auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    // If admin secret key is provided, add it to headers
    const headers = credentials.adminSecretKey 
      ? { 'Admin-Secret-Key': credentials.adminSecretKey } 
      : undefined;
    
    const response = await api.post('/Auth/register', credentials, { headers });
    return response.data;
  },

  getUserInfo: async (): Promise<UserInfo> => {
    const response = await api.get('/Account/user-info');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  validateUsername: async (username: string): Promise<boolean> => {
    try {
      const response = await api.post('/Auth/valide-username', { username });
      // Check if the response is a boolean or an object with a success/valid property
      if (typeof response.data === 'boolean') {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        // If it's an object, check for common response patterns
        if ('success' in response.data) return response.data.success;
        if ('valid' in response.data) return response.data.valid;
        if ('isValid' in response.data) return response.data.isValid;
        if ('available' in response.data) return response.data.available;
      }
      return true; // Default to true if response format is unknown
    } catch (error) {
      console.error('Username validation error:', error);
      throw error;
    }
  },

  validateEmail: async (email: string): Promise<boolean> => {
    try {
      const response = await api.post('/Auth/valide-email', { email });
      // Check if the response is a boolean or an object with a success/valid property
      if (typeof response.data === 'boolean') {
        return response.data;
      } else if (response.data && typeof response.data === 'object') {
        // If it's an object, check for common response patterns
        if ('success' in response.data) return response.data.success;
        if ('valid' in response.data) return response.data.valid;
        if ('isValid' in response.data) return response.data.isValid;
        if ('available' in response.data) return response.data.available;
      }
      return true; // Default to true if response format is unknown
    } catch (error) {
      console.error('Email validation error:', error);
      throw error;
    }
  },

  verifyEmail: async (email: string, code: string): Promise<boolean> => {
    try {
      const response = await api.post('/Auth/verify-email', { email, code });
      // Check if the response is a boolean or an object with a success property
      if (typeof response.data === 'boolean') {
        return response.data;
      } else if (response.data && typeof response.data === 'object' && 'success' in response.data) {
        return response.data.success;
      }
      return true; // Default to true if response format is unknown
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }
};

export default authService;
