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
import { useSettings } from "@/context/SettingsContext";

export interface UserSearchFilters {
  query: string;
  field: string;
  role: string;
  status: string;
}

interface UserSearchBarProps {
  filters: UserSearchFilters;
  onFiltersChange: (filters: UserSearchFilters) => void;
  className?: string;
  availableRoles?: Array<any>; // Accept available roles from parent
}

export function UserSearchBar({
  filters,
  onFiltersChange,
  className = "",
  availableRoles = [], // Use provided roles or fallback to defaults
}: UserSearchBarProps) {
  const [localQuery, setLocalQuery] = useState(filters.query);
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  // Theme-specific classes
  const searchBarClass = isLightMode
    ? "bg-gray-50 border-gray-200 shadow-sm"
    : "bg-blue-900/10 border-blue-900/30";

  const inputBgClass = isLightMode
    ? "bg-white border-gray-300 text-gray-900 placeholder:text-gray-500 focus-visible:ring-blue-500 focus-visible:ring-offset-gray-100"
    : "bg-blue-950/50 border-blue-900/50 text-white placeholder:text-blue-400/70 focus-visible:ring-blue-600 focus-visible:ring-offset-blue-950";

  const searchIconClass = isLightMode
    ? "text-gray-400"
    : "text-blue-400";

  const clearButtonClass = isLightMode
    ? "text-gray-400 hover:text-gray-800 hover:bg-gray-100"
    : "text-blue-400 hover:text-white hover:bg-blue-800/50";

  const selectTriggerClass = isLightMode
    ? "bg-white border-gray-300 text-gray-900"
    : "bg-blue-950/50 border-blue-900/50 text-white";

  const selectContentClass = isLightMode
    ? "bg-white border-gray-200 text-gray-900"
    : "bg-[#0a1033] border-blue-900/30 text-white";

  const selectItemHoverClass = isLightMode
    ? "hover:bg-gray-100"
    : "hover:bg-blue-900/20";

  const resetButtonClass = isLightMode
    ? "bg-white border-gray-300 text-blue-500 hover:text-blue-600 hover:bg-gray-50"
    : "bg-blue-950/50 border-blue-900/50 text-blue-400 hover:text-white hover:bg-blue-900/30";

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

  const handleRoleFilterChange = (role: string) => {
    onFiltersChange({
      ...filters,
      role,
    });
  };

  const handleStatusFilterChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status,
    });
  };

  const resetFilters = () => {
    onFiltersChange({
      query: "",
      field: "all",
      role: "all",
      status: "all",
    });
    setLocalQuery("");
  };

  const searchFields = [
    { id: "all", label: "All Fields" },
    { id: "name", label: "Full Name" },
    { id: "username", label: "Username" },
    { id: "email", label: "Email" },
    { id: "role", label: "Role" },
  ];

  // Helper function to extract role info from different role formats
  const getRoleInfo = (role: any) => {
    if (typeof role === "string") {
      return { id: role, label: role };
    }

    if (role && typeof role === "object") {
      const id = role.roleName || role.name || JSON.stringify(role);
      const label = role.roleName || role.name || "Unknown Role";
      return { id, label };
    }

    return { id: "Unknown", label: "Unknown Role" };
  };

  // Process available roles or use defaults
  const defaultRoles = [
    { id: "all", label: "All Roles" },
    { id: "Admin", label: "Admin" },
    { id: "FullUser", label: "Full User" },
    { id: "SimpleUser", label: "Simple User" },
  ];

  // Generate roles for the dropdown
  const roles =
    availableRoles.length > 0
      ? [{ id: "all", label: "All Roles" }, ...availableRoles.map(getRoleInfo)]
      : defaultRoles;

  // Make sure we don't have duplicate roles
  const uniqueRoles = roles.filter(
    (role, index, self) => index === self.findIndex((r) => r.id === role.id)
  );

  const statuses = [
    { id: "all", label: "All Statuses" },
    { id: "active", label: "Active" },
    { id: "inactive", label: "Inactive" },
  ];

  const selectedField =
    searchFields.find((f) => f.id === filters.field)?.label || "All Fields";
  const placeholder = `Search ${selectedField.toLowerCase()}...`;

  const hasActiveFilters =
    filters.query ||
    filters.field !== "all" ||
    filters.role !== "all" ||
    filters.status !== "all";

  return (
    <div className={`${className}`}>
      <div className={`flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:gap-3 p-4 rounded-lg border ${searchBarClass}`}>
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

        <div className="flex flex-wrap gap-3">
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

          <Select value={filters.role} onValueChange={handleRoleFilterChange}>
            <SelectTrigger className={`w-[140px] ${selectTriggerClass}`}>
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              {uniqueRoles.map((role) => (
                <SelectItem
                  key={role.id}
                  value={role.id}
                  className={selectItemHoverClass}
                >
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.status}
            onValueChange={handleStatusFilterChange}
          >
            <SelectTrigger className={`w-[140px] ${selectTriggerClass}`}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className={selectContentClass}>
              {statuses.map((status) => (
                <SelectItem
                  key={status.id}
                  value={status.id}
                  className={selectItemHoverClass}
                >
                  {status.label}
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
    </div>
  );
}
