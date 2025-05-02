import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminService, { UserDto, UpdateUserRequest, CreateUserRequest } from '@/services/adminService';
import { toast } from 'sonner';

export function useUserManagement() {
  const queryClient = useQueryClient();
  const queryKey = ['users'];
  const rolesQueryKey = ['roles'];
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch users data
  const { 
    data: allUsers = [], 
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers
  } = useQuery({
    queryKey: queryKey,
    queryFn: adminService.getAllUsers,
  });

  // Fetch roles data
  const {
    data: roles = [],
    isLoading: isLoadingRoles,
  } = useQuery({
    queryKey: rolesQueryKey,
    queryFn: adminService.getAllRoles,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserRequest) => adminService.createUser(data),
    onSuccess: () => {
      toast.success('User created successfully');
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      toast.error(`Failed to create user: ${error.message}`);
    }
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) => 
      adminService.updateUser(id, data),
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      toast.error(`Failed to update user: ${error.message}`);
    }
  });

  // Update user email mutation
  const updateUserEmailMutation = useMutation({
    mutationFn: ({ id, email }: { id: number; email: string }) => 
      adminService.updateUserEmail(id, email),
    onSuccess: () => {
      toast.success('Email updated successfully');
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      toast.error(`Failed to update email: ${error.message}`);
    }
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => adminService.deleteUser(id),
    onSuccess: () => {
      toast.success('User deleted successfully');
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete user: ${error.message}`);
    }
  });

  // Delete multiple users mutation
  const deleteMultipleUsersMutation = useMutation({
    mutationFn: (ids: number[]) => adminService.deleteMultipleUsers(ids),
    onSuccess: () => {
      toast.success('Users deleted successfully');
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: any) => {
      toast.error(`Failed to delete users: ${error.message}`);
    }
  });

  // Get user logs
  const getUserLogs = async (userId: number) => {
    try {
      return await adminService.getUserLogs(userId);
    } catch (error: any) {
      toast.error(`Failed to fetch user logs: ${error.message}`);
      return [];
    }
  };

  // Pagination helpers
  const paginatedUsers = allUsers.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.ceil(allUsers.length / pageSize);

  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages)));
  };

  const changePageSize = (newSize: number) => {
    setPageSize(newSize);
    setPage(1); // Reset to first page when changing page size
  };

  return {
    users: allUsers,
    paginatedUsers,
    isLoading: isLoadingUsers || isLoadingRoles,
    error: usersError,
    roles,
    page,
    pageSize,
    totalPages,
    totalItems: allUsers.length,
    goToPage,
    changePageSize,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    updateUserEmail: updateUserEmailMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,
    deleteMultipleUsers: deleteMultipleUsersMutation.mutateAsync,
    getUserLogs,
    refetchUsers
  };
} 