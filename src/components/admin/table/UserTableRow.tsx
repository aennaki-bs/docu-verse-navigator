import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { TableCell, TableRow } from "@/components/ui/table";
import { UserDto } from "@/services/adminService";
import { UserActionsDropdown } from "./row/UserActionsDropdown";
import { UserRoleSelect } from "./row/UserRoleSelect";
import { BlockUserDialog } from "./row/BlockUserDialog";

interface UserTableRowProps {
  user: UserDto;
  isSelected: boolean;
  onSelect: (userId: number) => void;
  onToggleStatus: (userId: number, currentStatus: boolean) => void;
  onRoleChange: (userId: number, roleName: string) => void;
  onEdit: (user: UserDto) => void;
  onEditEmail: (user: UserDto) => void;
  onViewLogs: (userId: number) => void;
  onDelete: (userId: number) => void;
}

function getRoleString(
  role: string | { roleId?: number; roleName?: string }
): string {
  if (typeof role === "string") {
    return role;
  }

  if (role && typeof role === "object" && "roleName" in role) {
    return role.roleName || "Unknown";
  }

  return "Unknown";
}

export function UserTableRow({
  user,
  isSelected,
  onSelect,
  onToggleStatus,
  onRoleChange,
  onEdit,
  onEditEmail,
  onViewLogs,
  onDelete,
}: UserTableRowProps) {
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const currentRole = getRoleString(user.role);

  const handleStatusToggle = () => {
    setShowBlockDialog(true);
  };

  const confirmStatusToggle = () => {
    onToggleStatus(user.id, user.isActive);
    setShowBlockDialog(false);
  };

  return (
    <>
      <TableRow
        className={`border-gray-700 hover:bg-[#0d1424] transition-all ${
          isSelected ? "bg-blue-900/20 border-l-4 border-l-blue-500" : ""
        }`}
      >
        <TableCell>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(user.id)}
            aria-label={`Select user ${user.username}`}
          />
        </TableCell>
        <TableCell>
          <Avatar>
            <AvatarImage src={user.profilePicture} alt={user.username} />
            <AvatarFallback className="bg-blue-600">
              {user.firstName.charAt(0)}
              {user.lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </TableCell>
        <TableCell className="font-medium text-white">
          {user.firstName} {user.lastName}
          <div className="text-xs text-gray-400">@{user.username}</div>
        </TableCell>
        <TableCell className="text-gray-300 max-w-[180px] truncate">
          <span className="block truncate">{user.email}</span>
        </TableCell>

        <TableCell>
          <UserRoleSelect
            currentRole={currentRole}
            onRoleChange={(role) => onRoleChange(user.id, role)}
          />
        </TableCell>

        <TableCell>
          {user.isActive ? (
            <Badge
              variant="secondary"
              className="bg-green-900/20 text-green-400 hover:bg-green-900/30"
            >
              Active
            </Badge>
          ) : (
            <Badge
              variant="destructive"
              className="bg-red-900/20 text-red-400 hover:bg-red-900/30"
            >
              Inactive
            </Badge>
          )}
        </TableCell>

        <TableCell>
          <div className="flex items-center">
            <Switch
              checked={user.isActive}
              onCheckedChange={handleStatusToggle}
              className={user.isActive ? "bg-green-600" : "bg-red-600"}
            />
          </div>
        </TableCell>

        <TableCell>
          <UserActionsDropdown
            user={user}
            onEdit={onEdit}
            onEditEmail={onEditEmail}
            onViewLogs={onViewLogs}
            onDelete={onDelete}
          />
        </TableCell>
      </TableRow>

      <BlockUserDialog
        isOpen={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        onConfirm={confirmStatusToggle}
        userName={`${user.firstName} ${user.lastName}`}
        isBlocked={user.isActive}
      />
    </>
  );
}
