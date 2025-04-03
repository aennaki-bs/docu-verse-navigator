
import api from './api';

export interface LoginCredentials {
  emailOrUsername: string;  // Changed from 'email' to match backend
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

// Interface for email validation requests
interface EmailValidationRequest {
  email: string;
}

// Interface for username validation requests
interface UsernameValidationRequest {
  username: string;
}

// Interface for email verification requests
interface EmailVerificationRequest {
  email: string;
  verificationCode: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/Auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<any> => {
    // If admin secret key is provided, add it to headers
    const headers = credentials.adminSecretKey 
      ? { 'AdminSecret': credentials.adminSecretKey } 
      : undefined;
    
    // Remove adminSecretKey from the request body as it should be in headers
    const { adminSecretKey, ...requestBody } = credentials;
    
    const response = await api.post('/Auth/register', requestBody, { headers });
    
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
      console.log('Validating username:', username);
      const request: UsernameValidationRequest = { username };
      const response = await api.post('/Auth/valide-username', request);
      
      console.log('Username validation response:', response.data);
      
      // Backend returns string "True" or "False"
      if (typeof response.data === 'string') {
        return response.data === "True";
      }
      
      return false;
    } catch (error) {
      console.error('Username validation error:', error);
      throw error;
    }
  },

  validateEmail: async (email: string): Promise<boolean> => {
    try {
      console.log('Validating email:', email);
      const request: EmailValidationRequest = { email };
      const response = await api.post('/Auth/valide-email', request);
      
      console.log('Email validation response:', response.data);
      
      // Backend returns string "True" or "False"
      if (typeof response.data === 'string') {
        return response.data === "True";
      }
      
      return false;
    } catch (error) {
      console.error('Email validation error:', error);
      throw error;
    }
  },

  verifyEmail: async (email: string, code: string): Promise<boolean> => {
    try {
      console.log('Verifying email:', email, 'with code:', code);
      const request: EmailVerificationRequest = { 
        email, 
        verificationCode: code 
      };
      
      const response = await api.post('/Auth/verify-email', request);
      console.log('Email verification response:', response.data);
      
      return true;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }
};

export default authService;
