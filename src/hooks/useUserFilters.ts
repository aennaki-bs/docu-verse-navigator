import { useState, useMemo } from 'react';
import { UserSearchFilters } from '@/components/admin/UserSearchBar';

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string | any;
  isActive: boolean;
  avatar?: string;
  initials: string;
  firstName?: string;
  lastName?: string;
}

export function useUserFilters(users: User[]) {
  const [filters, setFilters] = useState<UserSearchFilters>({
    query: '',
    field: 'all',
    role: 'all',
    status: 'all'
  });

  // Helper function to extract role name - centralizes role extraction logic
  const extractRoleName = (role: any): string => {
    if (typeof role === 'string') {
      return role;
    }
    
    if (role && typeof role === 'object') {
      // Try different properties that might contain the role name
      if (role.roleName) return role.roleName;
      if (role.name) return role.name;
      
      // Try to convert the object to string representation
      return JSON.stringify(role);
    }
    
    return 'Unknown';
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Text search filter
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const field = filters.field;

        // Helper function to match role - handles both string and object roles
        const matchesRole = (userRole: string | any, queryText: string): boolean => {
          const roleName = extractRoleName(userRole).toLowerCase();
          return roleName.includes(queryText);
        };

        if (field === 'all') {
          // For "All Fields" search, check all relevant fields
          const matchesFullName = user.name.toLowerCase().includes(query);
          const matchesFirstName = user.firstName?.toLowerCase().includes(query) || false;
          const matchesLastName = user.lastName?.toLowerCase().includes(query) || false;
          const matchesUsername = user.username.toLowerCase().includes(query);
          const matchesEmail = user.email.toLowerCase().includes(query);
          const matchesRoleName = matchesRole(user.role, query);

          if (!matchesFullName && !matchesUsername && !matchesEmail && 
              !matchesFirstName && !matchesLastName && !matchesRoleName) {
            return false;
          }
        } else if (field === 'name') {
          // For "Name" field, check full name, first name and last name
          const matchesFullName = user.name.toLowerCase().includes(query);
          const matchesFirstName = user.firstName?.toLowerCase().includes(query) || false;
          const matchesLastName = user.lastName?.toLowerCase().includes(query) || false;
          
          if (!matchesFullName && !matchesFirstName && !matchesLastName) {
            return false;
          }
        } else if (field === 'username' && !user.username.toLowerCase().includes(query)) {
          return false;
        } else if (field === 'email' && !user.email.toLowerCase().includes(query)) {
          return false;
        } else if (field === 'role' && !matchesRole(user.role, query)) {
          return false;
        }
      }

      // Role filter - improved to handle different role formats
      if (filters.role !== 'all') {
        const userRoleName = extractRoleName(user.role).toLowerCase();
        const filterRoleValue = filters.role.toLowerCase();
        
        // Try exact match first
        if (userRoleName !== filterRoleValue) {
          // Then try contains match (more flexible)
          if (!userRoleName.includes(filterRoleValue) && !filterRoleValue.includes(userRoleName)) {
            return false;
          }
        }
      }

      // Status filter
      if (filters.status !== 'all') {
        const isActive = filters.status === 'active';
        if (user.isActive !== isActive) {
          return false;
        }
      }

      return true;
    });
  }, [users, filters]);

  const updateFilters = (newFilters: Partial<UserSearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      field: 'all',
      role: 'all',
      status: 'all'
    });
  };

  return {
    filters,
    filteredUsers,
    updateFilters,
    setFilters,
    resetFilters
  };
} 