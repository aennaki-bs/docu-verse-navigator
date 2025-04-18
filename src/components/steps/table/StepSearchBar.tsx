
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StepSearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const StepSearchBar = ({ searchQuery, onSearchChange }: StepSearchBarProps) => {
  return (
    <div className="mb-4 relative">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Search steps..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-9 bg-background border-input"
      />
    </div>
  );
};
