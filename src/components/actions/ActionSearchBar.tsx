import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface ActionSearchFilters {
  query: string;
  field: string;
}

interface ActionSearchBarProps {
  filters: ActionSearchFilters;
  onFiltersChange: (filters: ActionSearchFilters) => void;
  className?: string;
}

export function ActionSearchBar({
  filters,
  onFiltersChange,
  className = "",
}: ActionSearchBarProps) {
  const [localQuery, setLocalQuery] = useState(filters.query);

  // Sync local state with props
  useEffect(() => {
    setLocalQuery(filters.query);
  }, [filters.query]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
    onFiltersChange({
      ...filters,
      query: e.target.value,
    });
  };

  const clearSearch = () => {
    setLocalQuery("");
    onFiltersChange({
      ...filters,
      query: "",
    });
  };

  const handleFieldChange = (field: string) => {
    onFiltersChange({
      ...filters,
      field,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      query: "",
      field: "all",
    });
    setLocalQuery("");
  };

  const searchFields = [
    { id: "all", label: "All Fields" },
    { id: "title", label: "Title" },
    { id: "description", label: "Description" },
    { id: "actionKey", label: "Action Key" },
  ];

  const selectedField =
    searchFields.find((f) => f.id === filters.field)?.label || "All Fields";
  const placeholder = `Search ${selectedField.toLowerCase()}...`;

  const hasActiveFilters = filters.query || filters.field !== "all";

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-3 p-4 bg-blue-900/10 rounded-lg border border-blue-900/30">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
          <Input
            placeholder={placeholder}
            value={localQuery}
            onChange={handleQueryChange}
            className="pl-9 pr-8 w-full bg-blue-950/50 border-blue-900/50 text-white placeholder:text-blue-400/70 focus-visible:ring-blue-600 focus-visible:ring-offset-blue-950"
          />
          {localQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-blue-400 hover:text-white hover:bg-blue-800/50"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Select value={filters.field} onValueChange={handleFieldChange}>
          <SelectTrigger className="w-[140px] bg-blue-950/50 border-blue-900/50 text-white">
            <SelectValue placeholder="All fields" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1033] border-blue-900/30 text-white">
            {searchFields.map((field) => (
              <SelectItem
                key={field.id}
                value={field.id}
                className="hover:bg-blue-900/20"
              >
                {field.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="bg-blue-950/50 border-blue-900/50 text-blue-400 hover:text-white hover:bg-blue-900/30"
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
