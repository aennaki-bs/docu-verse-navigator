
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
    const response = await api.post('/Auth/valide-username', { username });
    return response.data;
  },

  validateEmail: async (email: string): Promise<boolean> => {
    const response = await api.post('/Auth/valide-email', { email });
    return response.data;
  },

  verifyEmail: async (email: string, code: string): Promise<boolean> => {
    const response = await api.post('/Auth/verify-email', { email, code });
    return response.data;
  }
};

export default authService;
