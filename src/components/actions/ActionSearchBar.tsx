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
  theme?: string;
}

export function ActionSearchBar({
  filters,
  onFiltersChange,
  className = "",
  theme = "dark",
}: ActionSearchBarProps) {
  const [localQuery, setLocalQuery] = useState(filters.query);

  // Sync local state with props
  useEffect(() => {
    setLocalQuery(filters.query);
  }, [filters.query]);

  // Theme-specific classes
  const searchBarBgClass = theme === "dark"
    ? "bg-blue-900/10 border-blue-900/30"
    : "bg-gray-50 border-gray-200";

  const inputBgClass = theme === "dark"
    ? "bg-blue-950/50 border-blue-900/50 text-white placeholder:text-blue-400/70 focus-visible:ring-blue-600 focus-visible:ring-offset-blue-950"
    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus-visible:ring-blue-500 focus-visible:ring-offset-gray-100";

  const searchIconClass = theme === "dark"
    ? "text-blue-400"
    : "text-gray-400";

  const clearButtonClass = theme === "dark"
    ? "text-blue-400 hover:text-white hover:bg-blue-800/50"
    : "text-gray-400 hover:text-gray-800 hover:bg-gray-100";

  const selectTriggerClass = theme === "dark"
    ? "bg-blue-950/50 border-blue-900/50 text-white"
    : "bg-white border-gray-200 text-gray-900";

  const selectContentClass = theme === "dark"
    ? "bg-[#0a1033] border-blue-900/30 text-white"
    : "bg-white border-gray-200 text-gray-900";

  const selectItemHoverClass = theme === "dark"
    ? "hover:bg-blue-900/20"
    : "hover:bg-gray-100";

  const resetButtonClass = theme === "dark"
    ? "bg-blue-950/50 border-blue-900/50 text-blue-400 hover:text-white hover:bg-blue-900/30"
    : "bg-white border-gray-200 text-blue-500 hover:text-blue-600 hover:bg-gray-50";

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
      <div className={`flex items-center gap-3 p-4 rounded-lg border ${searchBarBgClass}`}>
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${searchIconClass}`} />
          <Input
            placeholder={placeholder}
            value={localQuery}
            onChange={handleQueryChange}
            className={`pl-9 pr-8 w-full ${inputBgClass}`}
          />
          {localQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 ${clearButtonClass}`}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Select value={filters.field} onValueChange={handleFieldChange}>
          <SelectTrigger className={`w-[140px] ${selectTriggerClass}`}>
            <SelectValue placeholder="All fields" />
          </SelectTrigger>
          <SelectContent className={selectContentClass}>
            {searchFields.map((field) => (
              <SelectItem
                key={field.id}
                value={field.id}
                className={selectItemHoverClass}
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
            className={resetButtonClass}
          >
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
}
