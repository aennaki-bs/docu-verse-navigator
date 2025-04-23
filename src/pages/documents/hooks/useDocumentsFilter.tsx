
import { useState, createContext, useContext, ReactNode } from 'react';
import { DateRange } from "react-day-picker";
import { FilterState } from '@/components/table';

interface DocumentsFilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  activeFilters: FilterState;
  applyFilters: (filters: FilterState) => void;
  resetFilters: () => void;
}

const initialFilterState: FilterState = {
  searchQuery: '',
  searchField: 'all',
  statusFilter: 'any',
  typeFilter: 'any',
  dateRange: undefined
};

const DocumentsFilterContext = createContext<DocumentsFilterContextType | undefined>(undefined);

export function DocumentsFilterProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [activeFilters, setActiveFilters] = useState<FilterState>(initialFilterState);

  const applyFilters = (filters: FilterState) => {
    // Update searchQuery and dateRange if they're in the filters
    if (filters.searchQuery !== undefined) {
      setSearchQuery(filters.searchQuery);
    }
    if (filters.dateRange !== undefined) {
      setDateRange(filters.dateRange);
    }
    
    setActiveFilters({
      ...activeFilters,
      ...filters
    });
  };

  const resetFilters = () => {
    setActiveFilters(initialFilterState);
    setDateRange(undefined);
    setSearchQuery('');
  };

  return (
    <DocumentsFilterContext.Provider value={{ 
      searchQuery, 
      setSearchQuery, 
      dateRange, 
      setDateRange,
      activeFilters,
      applyFilters,
      resetFilters
    }}>
      {children}
    </DocumentsFilterContext.Provider>
  );
}

export function useDocumentsFilter() {
  const context = useContext(DocumentsFilterContext);
  
  // If used outside provider, create a local state
  if (!context) {
    const [searchQuery, setSearchQuery] = useState('');
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [activeFilters, setActiveFilters] = useState<FilterState>(initialFilterState);
    
    const applyFilters = (filters: FilterState) => {
      // Update searchQuery and dateRange if they're in the filters
      if (filters.searchQuery !== undefined) {
        setSearchQuery(filters.searchQuery);
      }
      if (filters.dateRange !== undefined) {
        setDateRange(filters.dateRange);
      }
      
      setActiveFilters({
        ...activeFilters,
        ...filters
      });
    };

    const resetFilters = () => {
      setActiveFilters(initialFilterState);
      setDateRange(undefined);
      setSearchQuery('');
    };
    
    return { 
      searchQuery, 
      setSearchQuery, 
      dateRange, 
      setDateRange,
      activeFilters,
      applyFilters,
      resetFilters
    };
  }
  
  return context;
}
