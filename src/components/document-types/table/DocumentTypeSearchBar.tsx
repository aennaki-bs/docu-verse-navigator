
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface DocumentTypeSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const DocumentTypeSearchBar = ({
  searchQuery,
  onSearchChange
}: DocumentTypeSearchBarProps) => {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <div className="relative w-full max-w-xs">
        <div className="relative">
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
      </div>
    </div>
  );
};
