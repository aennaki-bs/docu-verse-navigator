import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Filter,
  X,
  UserCircle,
  Mail,
  User,
  Users,
  Columns,
} from "lucide-react";
import { SearchColumn } from "../hooks/useUserManagement";

interface UserTableFiltersProps {
  searchColumns: SearchColumn[];
  toggleSearchColumn: (column: SearchColumn) => void;
  activeFilter: "all" | "active" | "inactive";
  setActiveFilter: (filter: "all" | "active" | "inactive") => void;
  roleFilter: string | undefined;
  setRoleFilter: (role: string | undefined) => void;
  hasFiltersApplied: boolean;
  clearFilters: () => void;
}

export function UserTableFilters({
  searchColumns,
  toggleSearchColumn,
  activeFilter,
  setActiveFilter,
  roleFilter,
  setRoleFilter,
  hasFiltersApplied,
  clearFilters,
}: UserTableFiltersProps) {
  return (
    <div className="flex flex-col gap-4 mt-2 mb-4">
      <div className="flex flex-wrap gap-3 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-blue-400 border-blue-500 hover:text-blue-300 py-1 h-8"
            >
              <Columns className="h-3.5 w-3.5 mr-2" />
              Search Columns
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3 bg-[#0a1033] border-blue-900/50">
            <div className="space-y-2">
              <h4 className="font-medium text-blue-300 mb-2">Search In</h4>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="search-username"
                    checked={searchColumns.includes("username")}
                    onCheckedChange={() => toggleSearchColumn("username")}
                    className="border-blue-500/50 data-[state=checked]:bg-blue-600"
                  />
                  <label
                    htmlFor="search-username"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-100 flex items-center"
                  >
                    <UserCircle className="h-3.5 w-3.5 mr-1.5" /> Username
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="search-email"
                    checked={searchColumns.includes("email")}
                    onCheckedChange={() => toggleSearchColumn("email")}
                    className="border-blue-500/50 data-[state=checked]:bg-blue-600"
                  />
                  <label
                    htmlFor="search-email"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-100 flex items-center"
                  >
                    <Mail className="h-3.5 w-3.5 mr-1.5" /> Email
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="search-firstName"
                    checked={searchColumns.includes("firstName")}
                    onCheckedChange={() => toggleSearchColumn("firstName")}
                    className="border-blue-500/50 data-[state=checked]:bg-blue-600"
                  />
                  <label
                    htmlFor="search-firstName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-100 flex items-center"
                  >
                    <User className="h-3.5 w-3.5 mr-1.5" /> First Name
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="search-lastName"
                    checked={searchColumns.includes("lastName")}
                    onCheckedChange={() => toggleSearchColumn("lastName")}
                    className="border-blue-500/50 data-[state=checked]:bg-blue-600"
                  />
                  <label
                    htmlFor="search-lastName"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-blue-100 flex items-center"
                  >
                    <User className="h-3.5 w-3.5 mr-1.5" /> Last Name
                  </label>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Select
          value={roleFilter || "all"}
          onValueChange={(value) =>
            setRoleFilter(value === "all" ? undefined : value)
          }
        >
          <SelectTrigger
            className={`w-[130px] h-8 py-1 ${
              roleFilter
                ? "text-blue-400 border-blue-500"
                : "text-gray-400 border-blue-900/30"
            } bg-[#0a1033]/60`}
          >
            <Users className="h-3.5 w-3.5 mr-2" />
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1033] border-blue-900/50">
            <SelectItem value="all" className="flex items-center">
              <span className="flex items-center">All Roles</span>
            </SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="FullUser">FullUser</SelectItem>
            <SelectItem value="SimpleUser">SimpleUser</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-3 ml-auto">
          <div className="flex items-center space-x-1">
            <Switch
              id="show-all"
              checked={activeFilter === "all"}
              onCheckedChange={() => setActiveFilter("all")}
              className={activeFilter === "all" ? "bg-blue-600" : "bg-gray-600"}
            />
            <Label
              htmlFor="show-all"
              className={`text-sm ${
                activeFilter === "all" ? "text-blue-400" : "text-blue-300"
              }`}
            >
              All
            </Label>
          </div>

          <div className="flex items-center space-x-1">
            <Switch
              id="show-active"
              checked={activeFilter === "active"}
              onCheckedChange={() => setActiveFilter("active")}
              className={
                activeFilter === "active" ? "bg-green-600" : "bg-gray-600"
              }
            />
            <Label
              htmlFor="show-active"
              className={`text-sm ${
                activeFilter === "active" ? "text-green-400" : "text-blue-300"
              }`}
            >
              Active
            </Label>
          </div>

          <div className="flex items-center space-x-1">
            <Switch
              id="show-inactive"
              checked={activeFilter === "inactive"}
              onCheckedChange={() => setActiveFilter("inactive")}
              className={
                activeFilter === "inactive" ? "bg-red-600" : "bg-gray-600"
              }
            />
            <Label
              htmlFor="show-inactive"
              className={`text-sm ${
                activeFilter === "inactive" ? "text-red-400" : "text-blue-300"
              }`}
            >
              Inactive
            </Label>
          </div>
        </div>

        {hasFiltersApplied && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/30 py-1 h-8"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {searchColumns.length < 4 && (
          <Badge
            variant="outline"
            className="bg-blue-900/20 text-blue-300 border-blue-500/30 flex gap-1"
          >
            <Columns className="h-3 w-3 mr-1" />
            Searching in:{" "}
            {searchColumns
              .map((c) =>
                c === "username"
                  ? "Username"
                  : c === "email"
                  ? "Email"
                  : c === "firstName"
                  ? "First Name"
                  : c === "lastName"
                  ? "Last Name"
                  : ""
              )
              .join(", ")}
          </Badge>
        )}

        {roleFilter && (
          <Badge
            variant="outline"
            className="bg-blue-900/20 text-blue-300 border-blue-500/30 flex gap-1"
          >
            <Users className="h-3 w-3 mr-1" />
            Role: {roleFilter}
          </Badge>
        )}

        {activeFilter !== "all" && (
          <Badge
            variant="outline"
            className={`${
              activeFilter === "active"
                ? "bg-green-900/20 text-green-300 border-green-500/30"
                : "bg-red-900/20 text-red-300 border-red-500/30"
            } flex gap-1`}
          >
            <div
              className={`h-2 w-2 rounded-full ${
                activeFilter === "active" ? "bg-green-400" : "bg-red-400"
              } mt-1 mr-1`}
            ></div>
            {activeFilter === "active" ? "Active Users" : "Inactive Users"}
          </Badge>
        )}
      </div>
    </div>
  );
}
