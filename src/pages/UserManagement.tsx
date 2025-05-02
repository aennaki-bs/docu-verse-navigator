import { useState, useEffect } from "react";
import { toast } from "sonner";
import { UserTable } from "@/components/admin/UserTable";
import { UserSearchBar } from "@/components/admin/UserSearchBar";
import { UsersBulkBar } from "@/components/admin/UsersBulkBar";
import { CreateUserDialog } from "@/components/admin/CreateUserDialog";
import { ViewUserLogsDialog } from "@/components/admin/ViewUserLogsDialog";
import { EditUserDialog } from "@/components/admin/EditUserDialog";
import { ConfirmationDialog } from "@/components/admin/ConfirmationDialog";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserFilters } from "@/hooks/useUserFilters";
import { useUserManagement } from "@/hooks/useUserManagement";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettings } from "@/context/SettingsContext";

// Helper function to convert backend user data to UI format
const mapBackendUserToUiFormat = (user: any) => ({
  id: user.id,
  name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
  username: user.username,
  email: user.email,
  role: user.role,
  isActive: user.isActive,
  initials: `${(user.firstName || "").charAt(0)}${(user.lastName || "").charAt(
    0
  )}`,
  avatar: user.profilePicture,
  firstName: user.firstName,
  lastName: user.lastName,
  isEmailConfirmed: user.isEmailConfirmed,
  createdAt: user.createdAt,
});

// User details dialog component
function ViewUserDialog({
  user,
  open,
  onOpenChange,
}: {
  user: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  if (!user) return null;

  const formattedDate = new Date(user.createdAt).toLocaleDateString();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          isLightMode
            ? "bg-white"
            : "bg-[#0a1033] border-blue-900/30 text-white"
        }
      >
        <DialogHeader>
          <DialogTitle className={isLightMode ? "text-gray-900" : "text-white"}>
            User Details
          </DialogTitle>
          <DialogDescription
            className={isLightMode ? "text-gray-500" : "text-blue-300"}
          >
            Detailed information about this user.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              {user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback
                className={
                  isLightMode
                    ? "bg-blue-100 text-blue-700"
                    : "bg-blue-900 text-blue-300"
                }
              >
                {user.initials}
              </AvatarFallback>
            </Avatar>

            <div>
              <h3
                className={`text-lg font-medium ${
                  isLightMode ? "text-gray-900" : "text-white"
                }`}
              >
                {user.name}
              </h3>
              <p className={isLightMode ? "text-gray-500" : "text-blue-300"}>
                @{user.username}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p
                className={
                  isLightMode
                    ? "text-sm text-gray-500"
                    : "text-sm text-blue-300"
                }
              >
                Email
              </p>
              <p
                className={
                  isLightMode
                    ? "font-medium text-gray-900"
                    : "font-medium text-white"
                }
              >
                {user.email}
              </p>
              <Badge
                className={
                  user.isEmailConfirmed
                    ? isLightMode
                      ? "bg-green-100 text-green-800"
                      : "bg-green-900/30 text-green-400"
                    : isLightMode
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-yellow-900/30 text-yellow-400"
                }
              >
                {user.isEmailConfirmed ? "Verified" : "Unverified"}
              </Badge>
            </div>

            <div className="space-y-1">
              <p
                className={
                  isLightMode
                    ? "text-sm text-gray-500"
                    : "text-sm text-blue-300"
                }
              >
                Role
              </p>
              <p
                className={
                  isLightMode
                    ? "font-medium text-gray-900"
                    : "font-medium text-white"
                }
              >
                {typeof user.role === "string"
                  ? user.role
                  : user.role?.roleName || user.role?.name || "Unknown"}
              </p>
            </div>

            <div className="space-y-1">
              <p
                className={
                  isLightMode
                    ? "text-sm text-gray-500"
                    : "text-sm text-blue-300"
                }
              >
                Status
              </p>
              <Badge
                className={
                  user.isActive
                    ? isLightMode
                      ? "bg-green-100 text-green-800"
                      : "bg-green-900/30 text-green-400"
                    : isLightMode
                    ? "bg-gray-100 text-gray-800"
                    : "bg-gray-900/30 text-gray-400"
                }
              >
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            <div className="space-y-1">
              <p
                className={
                  isLightMode
                    ? "text-sm text-gray-500"
                    : "text-sm text-blue-300"
                }
              >
                Created
              </p>
              <p
                className={
                  isLightMode
                    ? "font-medium text-gray-900"
                    : "font-medium text-white"
                }
              >
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const UserManagement = () => {
  const { user: currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [viewingLogs, setViewingLogs] = useState<any>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [statusChangeUser, setStatusChangeUser] = useState<any>(null);
  const [roleChangeData, setRoleChangeData] = useState<{
    user: any;
    newRole: string;
  } | null>(null);
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  // Use the user management hook to fetch data and handle operations
  const {
    users: backendUsers,
    paginatedUsers: backendPaginatedUsers,
    isLoading,
    roles,
    page,
    pageSize,
    totalPages,
    totalItems,
    goToPage,
    changePageSize,
    createUser,
    updateUser,
    updateUserEmail,
    deleteUser,
    deleteMultipleUsers,
    getUserLogs,
  } = useUserManagement();

  // Debug roles data
  useEffect(() => {
    if (roles && roles.length > 0) {
      console.log("Roles data in UserManagement:", roles);
    }
  }, [roles]);

  // Map backend users to UI format
  const users = backendUsers.map(mapBackendUserToUiFormat);
  const paginatedUsers = backendPaginatedUsers.map(mapBackendUserToUiFormat);

  // Use the filtering hook with the mapped users
  const { filters, filteredUsers, setFilters } = useUserFilters(users);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (currentUser?.role !== "Admin") {
      toast.error(
        "You do not have permission to access the user management page"
      );
      navigate("/dashboard");
    }
  }, [isAuthenticated, currentUser, navigate]);

  const handleView = async (user: any) => {
    try {
      // If we already have all the user data, use it
      setViewingUser(user);
    } catch (error: any) {
      toast.error(`Failed to get user details: ${error.message}`);
    }
  };

  const handleEdit = async (user: any) => {
    setEditingUser(user);
  };

  const handleDelete = async (user: any) => {
    setUserToDelete(user);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);
      toast.success(`User ${userToDelete.name} deleted successfully`);
      setUserToDelete(null);
    } catch (error: any) {
      toast.error(`Failed to delete user: ${error.message}`);
    }
  };

  const handleViewLogs = async (user: any) => {
    try {
      // Just set the user for logs viewing
      setViewingLogs(user);
    } catch (error: any) {
      toast.error(`Failed to fetch logs: ${error.message}`);
    }
  };

  const handleEditEmail = async (user: any) => {
    // Open edit email dialog - implement this separately
    toast.info(`Edit email for: ${user.name}`);
  };

  const handleToggleStatus = async (user: any, isActive: boolean) => {
    // Set data for confirmation dialog
    setStatusChangeUser({ ...user, newStatus: isActive });
  };

  const confirmStatusChange = async () => {
    if (!statusChangeUser) return;

    try {
      await updateUser({
        id: statusChangeUser.id,
        data: { isActive: statusChangeUser.newStatus },
      });
      toast.success(
        `User ${statusChangeUser.name} is now ${
          statusChangeUser.newStatus ? "active" : "inactive"
        }`
      );
      setStatusChangeUser(null);
    } catch (error: any) {
      toast.error(`Failed to update user status: ${error.message}`);
    }
  };

  const handleRoleChange = async (user: any, role: string) => {
    // Set data for confirmation dialog
    setRoleChangeData({ user, newRole: role });
  };

  const confirmRoleChange = async () => {
    if (!roleChangeData) return;

    try {
      await updateUser({
        id: roleChangeData.user.id,
        data: { roleName: roleChangeData.newRole },
      });
      toast.success(
        `${roleChangeData.user.name}'s role changed to ${roleChangeData.newRole}`
      );
      setRoleChangeData(null);
    } catch (error: any) {
      toast.error(`Failed to update user role: ${error.message}`);
    }
  };

  const handleSaveUserEdit = async (userId: number, userData: any) => {
    try {
      await updateUser({
        id: userId,
        data: userData,
      });
      toast.success("User updated successfully");
    } catch (error: any) {
      toast.error(`Failed to update user: ${error.message}`);
      throw error;
    }
  };

  const handleUserSelection = (userId: number, selected: boolean) => {
    if (selected) {
      const userToAdd = users.find((u) => u.id === userId);
      if (userToAdd) {
        setSelectedUsers((prev) => [...prev, userToAdd]);
      }
    } else {
      setSelectedUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedUsers(filteredUsers);
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkDelete = async () => {
    try {
      const userIds = selectedUsers.map((u) => u.id);
      await deleteMultipleUsers(userIds);
      setSelectedUsers([]);
    } catch (error: any) {
      toast.error(`Failed to delete users: ${error.message}`);
    }
  };

  const handleBulkRoleChange = async (role: string) => {
    try {
      // Process role changes sequentially
      for (const user of selectedUsers) {
        await updateUser({
          id: user.id,
          data: { roleName: role },
        });
      }
      toast.success(
        `Role changed to ${role} for ${selectedUsers.length} users`
      );
    } catch (error: any) {
      toast.error(`Failed to update roles: ${error.message}`);
    }
  };

  return (
    <div className="space-y-6 p-6 pb-20">
      <div
        className={
          isLightMode
            ? "bg-white shadow-sm border border-gray-200 rounded-lg p-6 mb-6 transition-all"
            : "bg-[#0a1033] border border-blue-900/30 rounded-lg p-6 mb-6 transition-all"
        }
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1
              className={`text-2xl md:text-3xl font-semibold mb-2 ${
                isLightMode ? "text-gray-900" : "text-white"
              } flex items-center`}
            >
              <Users
                className={`mr-3 h-6 w-6 ${
                  isLightMode ? "text-blue-600" : "text-blue-400"
                }`}
              />{" "}
              User Management
            </h1>
            <p
              className={`text-sm md:text-base ${
                isLightMode ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Manage users and their permissions
            </p>
          </div>
          <Button
            onClick={() => setIsCreateUserOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
          >
            <UserPlus className="h-4 w-4" />
            Create User
          </Button>
        </div>
      </div>

      <div
        className={
          isLightMode
            ? "bg-white shadow-sm border border-gray-200 rounded-lg p-6 transition-all"
            : "bg-[#0a1033] border border-blue-900/30 rounded-lg p-6 transition-all"
        }
      >
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        ) : (
          <>
            <UserSearchBar
              filters={filters}
              onFiltersChange={setFilters}
              className="mb-4"
              availableRoles={roles}
            />

            {filteredUsers.length === 0 &&
            !filters.query &&
            filters.field === "all" &&
            filters.role === "all" &&
            filters.status === "all" ? (
              <div
                className={
                  isLightMode
                    ? "text-center py-12 bg-gray-50 rounded-lg border border-gray-200"
                    : "text-center py-12 bg-blue-900/10 rounded-lg border border-blue-900/30"
                }
              >
                <h3
                  className={`text-xl font-medium mb-2 ${
                    isLightMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  No Users Found
                </h3>
                <p
                  className={
                    isLightMode ? "text-gray-600 mb-4" : "text-blue-300 mb-4"
                  }
                >
                  Get started by creating your first user
                </p>
                <Button
                  onClick={() => setIsCreateUserOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div
                className={
                  isLightMode
                    ? "text-center py-12 bg-gray-50 rounded-lg border border-gray-200"
                    : "text-center py-12 bg-blue-900/10 rounded-lg border border-blue-900/30"
                }
              >
                <h3
                  className={`text-xl font-medium mb-2 ${
                    isLightMode ? "text-gray-900" : "text-white"
                  }`}
                >
                  No Matching Users
                </h3>
                <p
                  className={
                    isLightMode ? "text-gray-600 mb-4" : "text-blue-300 mb-4"
                  }
                >
                  Try adjusting your search filters
                </p>
              </div>
            ) : (
              <UserTable
                users={paginatedUsers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onViewLogs={handleViewLogs}
                onEditEmail={handleEditEmail}
                onToggleStatus={handleToggleStatus}
                onRoleChange={handleRoleChange}
                onView={handleView}
                onSelectUser={handleUserSelection}
                onSelectAll={handleSelectAll}
                selectedUsers={selectedUsers.map((u) => u.id)}
                // Pagination props
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                totalItems={totalItems}
                onPageChange={goToPage}
                onPageSizeChange={changePageSize}
                // Pass available roles from the API
                availableRoles={roles}
              />
            )}
          </>
        )}
      </div>

      <CreateUserDialog
        open={isCreateUserOpen}
        onOpenChange={setIsCreateUserOpen}
        roles={roles.map((role) => ({
          roleId: (role as any).id || (role as any).roleId || 0,
          roleName:
            (role as any).name || (role as any).roleName || role.toString(),
        }))}
        onSubmit={async (userData) => {
          try {
            await createUser(userData);
            setIsCreateUserOpen(false);
          } catch (error: any) {
            toast.error(`Failed to create user: ${error.message}`);
          }
        }}
      />

      {/* View User Dialog */}
      {viewingUser && (
        <ViewUserDialog
          user={viewingUser}
          open={!!viewingUser}
          onOpenChange={(open) => !open && setViewingUser(null)}
        />
      )}

      {/* View User Logs Dialog */}
      {viewingLogs && (
        <ViewUserLogsDialog
          userId={viewingLogs.id}
          username={viewingLogs.username}
          open={!!viewingLogs}
          onOpenChange={(open) => !open && setViewingLogs(null)}
        />
      )}

      {/* Edit User Dialog */}
      {editingUser && (
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
          onSubmit={handleSaveUserEdit}
          roles={roles}
        />
      )}

      {/* Delete User Confirmation Dialog */}
      {userToDelete && (
        <ConfirmationDialog
          title="Delete User"
          description={`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`}
          open={!!userToDelete}
          onOpenChange={(open) => !open && setUserToDelete(null)}
          onConfirm={confirmDeleteUser}
          confirmText="Delete"
          cancelText="Cancel"
          type="delete"
        />
      )}

      {/* Status Change Confirmation Dialog */}
      {statusChangeUser && (
        <ConfirmationDialog
          title={`${
            statusChangeUser.newStatus ? "Activate" : "Deactivate"
          } User`}
          description={`Are you sure you want to ${
            statusChangeUser.newStatus ? "activate" : "deactivate"
          } ${statusChangeUser.name}?`}
          open={!!statusChangeUser}
          onOpenChange={(open) => !open && setStatusChangeUser(null)}
          onConfirm={confirmStatusChange}
          confirmText={statusChangeUser.newStatus ? "Activate" : "Deactivate"}
          cancelText="Cancel"
          type={statusChangeUser.newStatus ? "success" : "warning"}
        />
      )}

      {/* Role Change Confirmation Dialog */}
      {roleChangeData && (
        <ConfirmationDialog
          title="Change User Role"
          description={`Are you sure you want to change ${roleChangeData.user.name}'s role to ${roleChangeData.newRole}?`}
          open={!!roleChangeData}
          onOpenChange={(open) => !open && setRoleChangeData(null)}
          onConfirm={confirmRoleChange}
          confirmText="Change Role"
          cancelText="Cancel"
          type="info"
        />
      )}

      {selectedUsers.length > 0 && (
        <UsersBulkBar
          selectedCount={selectedUsers.length}
          onDelete={handleBulkDelete}
          onChangeRole={handleBulkRoleChange}
        />
      )}
    </div>
  );
};

export default UserManagement;
