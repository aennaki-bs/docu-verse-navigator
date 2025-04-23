
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface DocumentTypeFiltersProps {
  onFilterChange: (filters: any) => void;
  onClose: () => void;
}

const DocumentTypeFilters = ({ onFilterChange, onClose }: DocumentTypeFiltersProps) => {
  const [filterType, setFilterType] = useState<string>('typeName');
  const [filterValue, setFilterValue] = useState<string>('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);

  const handleApplyFilters = () => {
    const filters = {
      type: filterType,
      value: filterValue,
      dateRange: dateRange
    };
    onFilterChange(filters);
  };

  const handleClearFilters = () => {
    setFilterType('typeName');
    setFilterValue('');
    setDateRange(undefined);
    onFilterChange({});
  };

  return (
    <div className="bg-[#0a1033] border border-blue-900/30 rounded-md p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium text-white">Filter Document Types</h3>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-8 w-8 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-3">
        <div>
          <label className="text-xs text-blue-300 mb-1 block">Filter by</label>
          <Select 
            value={filterType} 
            onValueChange={setFilterType}
          >
            <SelectTrigger className="bg-blue-900/20 border-blue-800/30">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="typeName">Type Name</SelectItem>
              <SelectItem value="typeKey">Type Key</SelectItem>
              <SelectItem value="documentCounter">Document Count</SelectItem>
              <SelectItem value="createdAt">Created Date</SelectItem>
              <SelectItem value="updatedAt">Updated Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {(filterType === 'createdAt' || filterType === 'updatedAt') ? (
          <div>
            <label className="text-xs text-blue-300 mb-1 block">Date Range</label>
            <DateRangePicker 
              date={dateRange}
              onDateChange={setDateRange}
              className="w-full"
            />
            {dateRange && dateRange.from && (
              <Badge className="mt-2 bg-blue-600/20 text-blue-400 border-blue-500/50">
                {dateRange.from ? format(dateRange.from, 'MMM dd, yyyy') : ''} 
                {dateRange.to ? ` - ${format(dateRange.to, 'MMM dd, yyyy')}` : ''}
              </Badge>
            )}
          </div>
        ) : (
          <div>
            <label className="text-xs text-blue-300 mb-1 block">Value</label>
            <Input 
              placeholder="Enter value"
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="bg-blue-900/20 border-blue-800/30 text-white"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleClearFilters}
          className="border-blue-800/50 text-blue-300 hover:bg-blue-900/30"
        >
          Clear
        </Button>
        <Button 
          size="sm"
          onClick={handleApplyFilters}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default DocumentTypeFilters;
