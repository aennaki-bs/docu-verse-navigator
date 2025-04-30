import { useState, useMemo } from 'react';
import { Action } from '@/models/action';
import { ActionSearchFilters } from '@/components/actions/ActionSearchBar';

export function useActionFilters(actions: Action[]) {
  const [filters, setFilters] = useState<ActionSearchFilters>({
    query: '',
    field: 'all'
  });

  const filteredActions = useMemo(() => {
    return actions.filter(action => {
      // Text search filter
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const field = filters.field;

        if (field === 'all') {
          const matchesTitle = action.title?.toLowerCase().includes(query);
          const matchesDescription = action.description?.toLowerCase().includes(query);
          const matchesKey = action.actionKey?.toLowerCase().includes(query);

          if (!matchesTitle && !matchesDescription && !matchesKey) {
            return false;
          }
        } else if (field === 'title' && !action.title?.toLowerCase().includes(query)) {
          return false;
        } else if (field === 'description' && !action.description?.toLowerCase().includes(query)) {
          return false;
        } else if (field === 'actionKey' && !action.actionKey?.toLowerCase().includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [actions, filters]);

  const updateFilters = (newFilters: Partial<ActionSearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const resetFilters = () => {
    setFilters({
      query: '',
      field: 'all'
    });
  };

  return {
    filters,
    filteredActions,
    updateFilters,
    setFilters,
    resetFilters
  };
} 