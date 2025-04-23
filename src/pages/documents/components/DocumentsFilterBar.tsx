
import { useState, useEffect } from 'react';
import { useDocumentsFilter } from '../hooks/useDocumentsFilter';
import { Button } from "@/components/ui/button";
import { Filter } from 'lucide-react';
import { 
  TableSearchBar, 
  TableAdvancedFilters, 
  TableActiveFilters,
  DEFAULT_STATUS_FILTERS,
  DEFAULT_TYPE_FILTERS,
  DEFAULT_DOCUMENT_SEARCH_FIELDS
} from '@/components/table';

export default function DocumentsFilterBar() {
  const { 
    searchQuery, 
    setSearchQuery, 
    dateRange, 
    setDateRange,
    activeFilters,
    applyFilters,
    resetFilters
  } = useDocumentsFilter();

  const [searchField, setSearchField] = useState("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isDatePickerEnabled, setIsDatePickerEnabled] = useState(false);

  // Advanced filters state
  const [statusFilter, setStatusFilter] = useState("any");
  const [typeFilter, setTypeFilter] = useState("any");
  const [advancedDateRange, setAdvancedDateRange] = useState(dateRange);

  useEffect(() => {
    setIsDatePickerEnabled(searchField === 'docDate');
    if (searchField !== 'docDate' && dateRange) {
      setDateRange(undefined);
    }
  }, [searchField, dateRange, setDateRange]);

  const handleCloseAdvancedFilters = () => {
    setShowAdvancedFilters(false);
  };

  const handleApplyAdvancedFilters = () => {
    // When advanced filters are applied, pass them to the main filter system
    const combinedFilters = {
      searchQuery: searchQuery, // Add the searchQuery property
      searchField,
      statusFilter,
      typeFilter,
      dateRange: advancedDateRange
    };
    applyFilters(combinedFilters);
    setShowAdvancedFilters(false);
  };

  const handleClearAdvancedFilters = () => {
    setStatusFilter("any");
    setTypeFilter("any");
    setAdvancedDateRange(undefined);
    resetFilters();
  };
  
  const handleClearDateRange = () => {
    setDateRange(undefined);
  };

  const handleClearStatusFilter = () => {
    setStatusFilter("any");
    applyFilters({
      ...activeFilters,
      statusFilter: "any"
    });
  };

  const handleClearTypeFilter = () => {
    setTypeFilter("any");
    applyFilters({
      ...activeFilters,
      typeFilter: "any"
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-lg text-white">Document List</div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <TableSearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            searchField={searchField}
            onSearchFieldChange={setSearchField}
            searchFields={DEFAULT_DOCUMENT_SEARCH_FIELDS}
            showDatePicker={isDatePickerEnabled}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onToggleAdvancedFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
            placeholderText="Search documents..."
          />
        </div>
      </div>
      
      {showAdvancedFilters && (
        <TableAdvancedFilters
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statusOptions={DEFAULT_STATUS_FILTERS}
          typeFilter={typeFilter}
          setTypeFilter={setTypeFilter}
          typeOptions={DEFAULT_TYPE_FILTERS}
          dateRange={advancedDateRange}
          setDateRange={setAdvancedDateRange}
          onClose={handleCloseAdvancedFilters}
          onApply={handleApplyAdvancedFilters}
          onClear={handleClearAdvancedFilters}
        />
      )}
      
      <TableActiveFilters
        dateRange={dateRange}
        onClearDateRange={handleClearDateRange}
        statusFilter={activeFilters.statusFilter}
        statusOptions={DEFAULT_STATUS_FILTERS}
        onClearStatus={handleClearStatusFilter}
        typeFilter={activeFilters.typeFilter}
        typeOptions={DEFAULT_TYPE_FILTERS}
        onClearType={handleClearTypeFilter}
        onClearAll={resetFilters}
      />
    </div>
  );
}
