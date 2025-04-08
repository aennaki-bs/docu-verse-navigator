
import api from './api';

export interface UserDto {
  id: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  isActive: boolean;
  isEmailConfirmed: boolean;
  profilePicture?: string;
  createdAt: string;
}

export interface LogHistoryDto {
  id: number;
  actionType: string;
  timestamp: string;
  user: {
    username: string;
    role: string;
  };
}

export interface CreateUserRequest {
  email: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  roleName: string;
}

export interface UpdateUserRequest {
  username?: string;
  passwordHash?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
  isEmailConfirmed?: boolean;
  roleName?: string;
}

export interface UpdateUserEmailRequest {
  email: string;
}

export interface Role {
  id: number;
  name: string;
}

const adminService = {
  // Get all users
  getAllUsers: async (): Promise<UserDto[]> => {
    try {
      const response = await api.get('/Admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (id: number): Promise<UserDto> => {
    try {
      const response = await api.get(`/Admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      throw error;
    }
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<UserDto> => {
    try {
      const response = await api.post('/Admin/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Update user
  updateUser: async (id: number, userData: UpdateUserRequest): Promise<string> => {
    try {
      const response = await api.put(`/Admin/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }
  },

  // Update user email
  updateUserEmail: async (id: number, email: string): Promise<string> => {
    try {
      const response = await api.put(`/Admin/users/email/${id}`, { email });
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${id} email:`, error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: number): Promise<string> => {
    try {
      const response = await api.delete(`/Admin/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${id}:`, error);
      throw error;
    }
  },

  // Delete multiple users
  deleteMultipleUsers: async (userIds: number[]): Promise<string> => {
    try {
      const response = await api.delete('/Admin/delete-users', { 
        data: userIds 
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting multiple users:', error);
      throw error;
    }
  },

  // Get user log history
  getUserLogs: async (userId: number): Promise<LogHistoryDto[]> => {
    try {
      const response = await api.get(`/Admin/logs/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching logs for user ${userId}:`, error);
      throw error;
    }
  },

  // Get all roles
  getAllRoles: async (): Promise<Role[]> => {
    try {
      const response = await api.get('/Admin/roles');
      return response.data;
    } catch (error) {
      console.error('Error fetching roles:', error);
      throw error;
    }
  }
};

export default adminService;
