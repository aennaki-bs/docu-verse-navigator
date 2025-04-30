import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import adminService, { UserDto } from '@/services/adminService';

// Define search column type
export type SearchColumn = 'username' | 'email' | 'firstName' | 'lastName';

export function useUserManagement() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [editEmailUser, setEditEmailUser] = useState<UserDto | null | null>(null);
  const [viewingUserLogs, setViewingUserLogs] = useState<number | null>(null);
  const [deletingUser, setDeletingUser] = useState<number | null>(null);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleChangeOpen, setRoleChangeOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  
  // Enhanced filter states - remove role from default columns
  const [searchColumns, setSearchColumns] = useState<SearchColumn[]>(['username', 'email', 'firstName', 'lastName']);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);

  const { data: users, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminService.getAllUsers(),
  });

  // Debug function to log user data for troubleshooting
  const debugUsers = () => {
    if (users) {
      console.log('Available users:', users);
      console.log('Current roleFilter:', roleFilter);
      users.forEach(user => {
        console.log(`User: ${user.username}, Role: ${user.role}, Type: ${typeof user.role}`);
        if (roleFilter) {
          const matches = matchesRole(user, roleFilter);
          console.log(`  Matches role "${roleFilter}": ${matches}`);
        }
      });
    }
  };

  // Helper function to determine if a user's role matches the filter
  const matchesRole = (user: UserDto, filter: string): boolean => {
    // Handle all possible formats of the role property
    if (filter === 'all') return true;
    
    if (typeof user.role === 'string') {
      return user.role === filter;
    } 
    
    if (typeof user.role === 'object' && user.role !== null) {
      // Try to extract role info from object
      const roleObj = user.role as any;
      if (roleObj.name) return roleObj.name === filter;
      if (roleObj.role) return roleObj.role === filter;
      
      // Try to convert the object to string representation and check if it contains the filter
      const roleStr = JSON.stringify(roleObj).toLowerCase();
      return roleStr.includes(filter.toLowerCase());
    }
    
    // Last resort, compare string forms
    return String(user.role) === filter;
  };

  // Disable filters if no users are available
  useEffect(() => {
    if (users && users.length === 0) {
      clearFilters();
    }
  }, [users]);

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = (filteredUsers: UserDto[]) => {
    if (selectedUsers.length === filteredUsers?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers?.map(user => user.id) || []);
    }
  };

  const handleUserEdited = () => {
    refetch();
    setEditingUser(null);
  };

  const handleUserEmailEdited = () => {
    refetch();
    setEditEmailUser(null);
  };

  const handleUserDeleted = () => {
    refetch();
    setDeletingUser(null);
    setSelectedUsers([]);
  };

  const handleMultipleDeleted = () => {
    refetch();
    setSelectedUsers([]);
    setDeleteMultipleOpen(false);
  };

  // Toggle a search column
  const toggleSearchColumn = (column: SearchColumn) => {
    setSearchColumns(prev => {
      if (prev.includes(column)) {
        // Don't allow removing the last column
        if (prev.length === 1) return prev;
        return prev.filter(c => c !== column);
      } else {
        return [...prev, column];
      }
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilter('all');
    setRoleFilter(undefined);
    setSearchColumns(['username', 'email', 'firstName', 'lastName']);
  };

  const filteredUsers = users?.filter(user => {
    // Filter by active status
    if (activeFilter === 'active' && !user.isActive) return false;
    if (activeFilter === 'inactive' && user.isActive) return false;
    
    // Filter by role using the improved matching function
    if (roleFilter && roleFilter !== 'all') {
      if (!matchesRole(user, roleFilter)) {
        return false;
      }
    }
    
    // If no search query, return all users that match the active filter
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    
    // Search in all selected columns
    return searchColumns.some(column => {
      switch (column) {
        case 'username':
          return user.username?.toLowerCase().includes(searchLower) || false;
        case 'email':
          return user.email?.toLowerCase().includes(searchLower) || false;
        case 'firstName':
          return user.firstName?.toLowerCase().includes(searchLower) || false;
        case 'lastName':
          return user.lastName?.toLowerCase().includes(searchLower) || false;
        default:
          return false;
      }
    });
  });

  return {
    selectedUsers,
    editingUser,
    editEmailUser,
    viewingUserLogs,
    deletingUser,
    deleteMultipleOpen,
    searchQuery,
    roleChangeOpen,
    selectedRole,
    searchColumns,
    setSearchColumns,
    toggleSearchColumn,
    activeFilter,
    setActiveFilter,
    roleFilter,
    setRoleFilter,
    clearFilters,
    users: filteredUsers,
    isLoading,
    isError,
    refetch,
    setEditingUser,
    setEditEmailUser,
    setViewingUserLogs,
    setDeletingUser,
    setDeleteMultipleOpen,
    setSearchQuery,
    setRoleChangeOpen,
    setSelectedRole,
    handleSelectUser,
    handleSelectAll,
    handleUserEdited,
    handleUserEmailEdited,
    handleUserDeleted,
    handleMultipleDeleted,
    debugUsers,
  };
}
