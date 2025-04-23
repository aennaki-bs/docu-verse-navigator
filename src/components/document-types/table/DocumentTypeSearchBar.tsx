
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { Button } from '@/components/ui/button';

interface DocumentTypeSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchField?: string;
  onFieldChange?: (field: string) => void;
  onToggleFilters?: () => void;
  showFilters?: boolean;
}

export const DocumentTypeSearchBar = ({
  searchQuery,
  onSearchChange,
  searchField = "all",
  onFieldChange,
  onToggleFilters,
  showFilters = false
}: DocumentTypeSearchBarProps) => {
  return (
    <div className="flex items-center justify-between gap-2 p-2">
      <div className="relative w-full flex-1">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-blue-400" />
        <Input
          placeholder="Search document types..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8 py-1 h-9 text-sm bg-blue-900/10 border-blue-800/30 text-white placeholder:text-blue-300/50 w-full rounded-md"
        />
        {searchQuery && (
          <button 
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-blue-400 hover:text-blue-300"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
      
      <div className="flex gap-2">
        {onToggleFilters && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleFilters}
            className={`h-9 flex items-center gap-1 ${showFilters ? 'bg-blue-600/20 border-blue-500' : ''}`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filters</span>
          </Button>
        )}
        
        {onFieldChange && (
          <Select value={searchField} onValueChange={onFieldChange}>
            <SelectTrigger className="w-[130px] h-9">
              <SelectValue placeholder="All fields" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All fields</SelectItem>
              <SelectItem value="typeKey">Document Code</SelectItem>
              <SelectItem value="typeName">Type Name</SelectItem>
              <SelectItem value="typeAttr">Attributes</SelectItem>
              <SelectItem value="documentCounter">Document Count</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );
};
