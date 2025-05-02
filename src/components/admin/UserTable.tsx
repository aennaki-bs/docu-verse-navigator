import { useState } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pencil,
  Trash2,
  Eye,
  Mail,
  UserCog,
  History,
  MoreVertical,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TablePagination } from "./TablePagination";
import { useSettings } from "@/context/SettingsContext";

interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string | { roleId: number; roleName: string };
  isActive: boolean;
  avatar?: string;
  initials: string;
}

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onViewLogs?: (user: User) => void;
  onEditEmail?: (user: User) => void;
  onToggleStatus?: (user: User, isActive: boolean) => void;
  onRoleChange?: (user: User, role: string) => void;
  onView?: (user: User) => void;
  selectedUsers?: number[];
  onSelectUser?: (userId: number, selected: boolean) => void;
  onSelectAll?: (selected: boolean) => void;
  isSimpleUser?: boolean;
  // Pagination props
  page?: number;
  pageSize?: number;
  totalPages?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  // Available roles prop
  availableRoles?: Array<{
    id?: number;
    name?: string;
    roleId?: number;
    roleName?: string;
  }>;
}

export function UserTable({
  users,
  onEdit,
  onDelete,
  onViewLogs,
  onEditEmail,
  onToggleStatus,
  onRoleChange,
  onView,
  selectedUsers: externalSelectedUsers = [],
  onSelectUser,
  onSelectAll,
  isSimpleUser = false,
  // Pagination props
  page = 1,
  pageSize = 10,
  totalPages = 1,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
  // Available roles
  availableRoles = [],
}: UserTableProps) {
  const [selected, setSelected] = useState<number[]>(externalSelectedUsers);
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  // Helper function to safely get role name from a string or object
  const getRoleName = (role: any): string => {
    if (typeof role === "string") {
      return role;
    }
    if (role && typeof role === "object") {
      if ("roleName" in role) return role.roleName;
      if ("name" in role) return role.name;
    }
    return "Unknown";
  };

  // Helper function to safely get role ID from a role object
  const getRoleId = (role: any): number | string => {
    if (typeof role === "string") return role; // Use string as ID for string roles
    if (role && typeof role === "object") {
      if ("id" in role && role.id !== undefined) return role.id;
      if ("roleId" in role && role.roleId !== undefined) return role.roleId;
    }
    return 0;
  };

  // Get the CSS class for a role badge based on role name
  const getRoleBadgeClass = (roleName: string): string => {
    const roleNameLower = roleName.toLowerCase();
    if (isLightMode) {
      if (roleNameLower.includes("admin")) {
        return "bg-red-100 border-red-300 text-red-700";
      } else if (
        roleNameLower.includes("manager") ||
        roleNameLower.includes("full")
      ) {
        return "bg-amber-100 border-amber-300 text-amber-700";
      } else {
        return "bg-blue-100 border-blue-300 text-blue-700";
      }
    } else {
      // Dark mode styles
      if (roleNameLower.includes("admin")) {
        return "bg-red-900/30 border-red-700/50 text-red-400";
      } else if (
        roleNameLower.includes("manager") ||
        roleNameLower.includes("full")
      ) {
        return "bg-amber-900/30 border-amber-700/50 text-amber-400";
      } else {
        return "bg-blue-900/30 border-blue-700/50 text-blue-400";
      }
    }
  };

  const isSelected = (userId: number) => selected.includes(userId);

  const handleSelectAll = () => {
    if (selected.length === users.length) {
      setSelected([]);
      onSelectAll?.(false);
    } else {
      const allUserIds = users.map((user) => user.id);
      setSelected(allUserIds);
      onSelectAll?.(true);
    }
  };

  const handleSelectUser = (userId: number) => {
    const isAlreadySelected = isSelected(userId);
    let newSelected: number[];

    if (isAlreadySelected) {
      newSelected = selected.filter((id) => id !== userId);
    } else {
      newSelected = [...selected, userId];
    }

    setSelected(newSelected);
    onSelectUser?.(userId, !isAlreadySelected);
  };

  const hasSelectionFeature = onSelectUser || onSelectAll;
  const hasPagination = onPageChange && onPageSizeChange;

  // Default roles if none provided from API
  const roleOptions =
    availableRoles.length > 0
      ? availableRoles
      : [
          { id: 1, name: "Admin" },
          { id: 2, name: "FullUser" },
          { id: 3, name: "SimpleUser" },
        ];

  // Configure table styles based on theme
  const tableStyles = isLightMode
    ? {
        container:
          "bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden",
        header: "bg-gray-50",
        headerRow: "hover:bg-gray-100 border-b border-gray-200",
        headerText: "text-gray-700 font-semibold",
        row: "border-b border-gray-200 hover:bg-gray-50",
        selectedRow: "bg-blue-50 hover:bg-blue-100",
        cell: "text-gray-800",
        mutedText: "text-gray-500",
      }
    : {
        container:
          "bg-[#0f1642] border border-blue-900/30 rounded-md overflow-hidden",
        header: "bg-blue-900/20",
        headerRow: "hover:bg-blue-900/30 border-b border-blue-900/30",
        headerText: "text-blue-300 font-semibold",
        row: "border-b border-blue-900/20 hover:bg-blue-900/10",
        selectedRow: "bg-blue-900/30 hover:bg-blue-900/40",
        cell: "text-white",
        mutedText: "text-muted-foreground",
      };

  return (
    <div className={tableStyles.container}>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className={tableStyles.header}>
            <TableRow className={tableStyles.headerRow}>
              {hasSelectionFeature && (
                <TableHead className="w-[50px] text-center">
                  <Checkbox
                    checked={
                      selected.length > 0 && selected.length === users.length
                    }
                    indeterminate={
                      selected.length > 0 && selected.length < users.length
                    }
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                  />
                </TableHead>
              )}
              <TableHead className={tableStyles.headerText}>User</TableHead>
              <TableHead className={tableStyles.headerText}>Email</TableHead>
              <TableHead className={tableStyles.headerText}>Role</TableHead>
              <TableHead className={tableStyles.headerText}>Status</TableHead>
              {!isSimpleUser && (
                <TableHead className={tableStyles.headerText}>Active</TableHead>
              )}
              <TableHead className={`text-right ${tableStyles.headerText}`}>
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow className={tableStyles.row}>
                <TableCell
                  colSpan={hasSelectionFeature ? 7 : 6}
                  className="h-24 text-center"
                >
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  className={`${
                    isSelected(user.id)
                      ? tableStyles.selectedRow
                      : tableStyles.row
                  }`}
                >
                  {hasSelectionFeature && (
                    <TableCell className="text-center">
                      <Checkbox
                        checked={isSelected(user.id)}
                        onCheckedChange={() => handleSelectUser(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {user.avatar && (
                          <AvatarImage src={user.avatar} alt={user.name} />
                        )}
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{user.name}</span>
                        <span className={`text-xs ${tableStyles.mutedText}`}>
                          @{user.username}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={tableStyles.mutedText}>
                    {user.email}
                  </TableCell>
                  <TableCell>
                    {onRoleChange ? (
                      <Select
                        defaultValue={getRoleName(user.role)}
                        onValueChange={(value) => onRoleChange(user, value)}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs bg-transparent">
                          <SelectValue>
                            <Badge
                              variant="outline"
                              className={getRoleBadgeClass(
                                getRoleName(user.role)
                              )}
                            >
                              {getRoleName(user.role)}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent
                          className={
                            isLightMode
                              ? "bg-white border-gray-200"
                              : "bg-[#0a1033] border-blue-900/30 text-white"
                          }
                        >
                          {roleOptions.map((role) => (
                            <SelectItem
                              key={getRoleId(role)}
                              value={getRoleName(role)}
                              className={
                                isLightMode
                                  ? "hover:bg-gray-100"
                                  : "hover:bg-blue-900/30"
                              }
                            >
                              <Badge
                                variant="outline"
                                className={getRoleBadgeClass(getRoleName(role))}
                              >
                                {getRoleName(role)}
                              </Badge>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge
                        variant="outline"
                        className={getRoleBadgeClass(getRoleName(user.role))}
                      >
                        {getRoleName(user.role)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        user.isActive
                          ? isLightMode
                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                            : "bg-emerald-900/20 text-emerald-400 border-emerald-700/30"
                          : isLightMode
                          ? "bg-gray-100 text-gray-700 border-gray-200"
                          : "bg-gray-700/20 text-gray-400 border-gray-600/30"
                      }
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  {!isSimpleUser && (
                    <TableCell>
                      <Switch
                        checked={user.isActive}
                        onCheckedChange={(checked) => {
                          if (onToggleStatus) {
                            onToggleStatus(user, checked);
                          }
                        }}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </TableCell>
                  )}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-8 w-8 ${
                            isLightMode
                              ? "text-gray-600 hover:bg-gray-100"
                              : "text-blue-400 hover:bg-blue-900/50"
                          }`}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className={
                          isLightMode
                            ? "bg-white border-gray-200"
                            : "bg-[#0a1033] border-blue-900/30"
                        }
                      >
                        {onView && (
                          <DropdownMenuItem
                            onClick={() => onView(user)}
                            className={
                              isLightMode
                                ? "hover:bg-gray-100"
                                : "text-blue-300 hover:bg-blue-900/50"
                            }
                          >
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                        )}
                        {onEdit && (
                          <DropdownMenuItem
                            onClick={() => onEdit(user)}
                            className={
                              isLightMode
                                ? "hover:bg-gray-100"
                                : "text-yellow-300 hover:bg-blue-900/50"
                            }
                          >
                            <Pencil className="h-4 w-4 mr-2" /> Edit User
                          </DropdownMenuItem>
                        )}
                        {onEditEmail && (
                          <DropdownMenuItem
                            onClick={() => onEditEmail(user)}
                            className={
                              isLightMode
                                ? "hover:bg-gray-100"
                                : "text-indigo-300 hover:bg-blue-900/50"
                            }
                          >
                            <Mail className="h-4 w-4 mr-2" /> Change Email
                          </DropdownMenuItem>
                        )}
                        {onViewLogs && (
                          <DropdownMenuItem
                            onClick={() => onViewLogs(user)}
                            className={
                              isLightMode
                                ? "hover:bg-gray-100"
                                : "text-purple-300 hover:bg-blue-900/50"
                            }
                          >
                            <History className="h-4 w-4 mr-2" /> View Logs
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => onDelete(user)}
                              className={
                                isLightMode
                                  ? "text-red-600 hover:bg-red-50"
                                  : "text-red-400 hover:bg-red-900/20"
                              }
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete User
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {hasPagination && (
        <TablePagination
          currentPage={page}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}
