import api from './api';

export interface LoginCredentials {
  emailOrUsername: string;
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
  role?: string;
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

// Interface for forgot password request
interface ForgotPasswordRequest {
  email: string;
}

// Interface for update password request
interface UpdatePasswordRequest {
  email: string;
  newPassword: string;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await api.post('/Auth/login', credentials);
      console.log('Auth response data:', response.data);
      
      // If API returns accessToken directly
      if (response.data.accessToken) {
        // Get user info with the token
        localStorage.setItem('token', response.data.accessToken);
        
        // Fetch user info immediately
        try {
          const userInfoResponse = await api.get('/Account/user-info');
          console.log('User info fetched:', userInfoResponse.data);
          
          return {
            token: response.data.accessToken,
            user: userInfoResponse.data
          };
        } catch (error) {
          console.error('Error fetching user info:', error);
          throw error;
        }
      } 
      // If API already returns both token and user
      else if (response.data.token && response.data.user) {
        return response.data;
      }
      
      throw new Error('Invalid response format from authentication server');
    } catch (error) {
      console.error('Login error in service:', error);
      throw error;
    }
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
    try {
      const response = await api.get('/Account/user-info');
      console.log('User info response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw error;
    }
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
  },

  forgotPassword: async (email: string): Promise<string> => {
    try {
      console.log('Requesting password reset for email:', email);
      const request: ForgotPasswordRequest = { email };
      const response = await api.post('/Account/forgot-password', request);
      
      console.log('Password reset response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Password reset request error:', error);
      if (error.response?.status === 401 && error.response?.data === "Email Not Verified!") {
        // If email is not verified, resend the verification code
        await authService.resendVerificationCode(email);
        throw new Error("Email not verified. A new verification code has been sent.");
      }
      throw error;
    }
  },

  resendVerificationCode: async (email: string): Promise<string> => {
    try {
      console.log('Resending verification code for email:', email);
      const request: ForgotPasswordRequest = { email };
      const response = await api.post('/Account/resend-code', request);
      
      console.log('Resend verification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  },

  updatePassword: async (email: string, newPassword: string): Promise<string> => {
    try {
      console.log('Updating password for email:', email);
      const request: UpdatePasswordRequest = { 
        email, 
        newPassword 
      };
      const response = await api.put('/Account/update-password', request);
      
      console.log('Update password response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Update password error:', error);
      throw error;
    }
  }
};

export default authService;
