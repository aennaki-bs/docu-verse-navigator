import { Link } from 'react-router-dom';
import { LayoutGrid, LayoutList, Plus, Search, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useSettings } from '@/context/SettingsContext';

interface DocumentTypesHeaderProps {
  viewMode: 'table' | 'grid';
  onViewModeChange: (value: 'table' | 'grid') => void;
  onNewTypeClick: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const DocumentTypesHeader = ({ 
  viewMode, 
  onViewModeChange, 
  onNewTypeClick,
  searchQuery,
  onSearchChange,
  showFilters,
  onToggleFilters 
}: DocumentTypesHeaderProps) => {
  const { theme } = useSettings();

  const handleViewModeChange = (value: string) => {
    if (value === 'table' || value === 'grid') {
      onViewModeChange(value);
    }
  };

  // Define conditional classes based on the theme
  const headerBgClass = theme === 'dark' 
    ? 'bg-[#0f1642] border-blue-900/30' 
    : 'bg-white border-gray-200 shadow-sm';
  
  const titleClass = theme === 'dark' 
    ? 'text-white' 
    : 'text-gray-800';
  
  const subtitleClass = theme === 'dark' 
    ? 'text-blue-300' 
    : 'text-gray-500';
  
  const searchInputClass = theme === 'dark'
    ? 'bg-blue-900/20 border-blue-800/30 text-white placeholder:text-blue-300/50'
    : 'bg-gray-50 border-gray-200 text-gray-800 placeholder:text-gray-400';
  
  const searchIconClass = theme === 'dark'
    ? 'text-blue-300/70'
    : 'text-gray-400';
  
  const clearBtnClass = theme === 'dark'
    ? 'text-blue-300 hover:text-blue-200'
    : 'text-gray-500 hover:text-gray-700';
  
  const filterBtnClass = theme === 'dark'
    ? `${showFilters ? 'bg-blue-700/50 text-blue-200' : 'text-blue-300/70'}`
    : `${showFilters ? 'bg-blue-100 text-blue-700' : 'text-gray-500'}`;
  
  const newBtnClass = theme === 'dark'
    ? 'bg-blue-600 hover:bg-blue-700'
    : 'bg-blue-500 hover:bg-blue-600 text-white';

  return (
    <div className={`${headerBgClass} p-4 md:p-6 border-b flex-shrink-0`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <h1 className={`text-2xl font-bold ${titleClass}`}>Document Types</h1>
            <p className={`text-sm ${subtitleClass} mt-1`}>
              Manage document classification system
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full max-w-md">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className={`h-4 w-4 ${searchIconClass}`} />
            </div>
            <Input 
              placeholder="Search document types..." 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`pl-10 pr-20 py-2 ${searchInputClass} w-full h-10 rounded-md`}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className={`absolute inset-y-0 right-16 flex items-center pr-3 ${clearBtnClass}`}
              >
                <span className="text-xs">Clear</span>
              </button>
            )}
            <div className="absolute inset-y-0 right-0 flex items-center gap-1 pr-2">
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 ${filterBtnClass}`}
                onClick={onToggleFilters}
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <ToggleGroup type="single" value={viewMode} onValueChange={handleViewModeChange} className="hidden sm:flex">
              <ToggleGroupItem value="table" aria-label="Table view" className="h-10 w-10">
                <LayoutList className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="grid" aria-label="Grid view" className="h-10 w-10">
                <LayoutGrid className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>

            <Button className={`h-10 px-4 ${newBtnClass}`} onClick={onNewTypeClick}>
              <Plus className="mr-2 h-4 w-4" /> New Type
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentTypesHeader;
