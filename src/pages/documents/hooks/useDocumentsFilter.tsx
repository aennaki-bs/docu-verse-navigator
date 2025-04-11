
import { useState, createContext, useContext, ReactNode } from 'react';
import { DateRange } from "react-day-picker";

interface DocumentsFilterContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
}

const DocumentsFilterContext = createContext<DocumentsFilterContextType | undefined>(undefined);

export function DocumentsFilterProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  return (
    <DocumentsFilterContext.Provider value={{ searchQuery, setSearchQuery, dateRange, setDateRange }}>
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
    
    return { searchQuery, setSearchQuery, dateRange, setDateRange };
  }
  
  return context;
}
