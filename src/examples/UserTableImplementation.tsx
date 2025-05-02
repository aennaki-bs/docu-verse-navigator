import { useState } from "react";
import { UserTable } from "@/components/admin/UserTable";

// Example user data
interface UserItem {
  id: number;
  name: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  avatar?: string;
  initials: string;
  toggle?: boolean;
}

// Example of how to use the UserTable
export function UserTableImplementation() {
  const [users, setUsers] = useState<UserItem[]>([
    {
      id: 1,
      name: "Ahmed Hamouda",
      username: "aennaki",
      email: "ahmed.ennaki@gmail.com",
      role: "FullUser",
      isActive: true,
      initials: "AH",
    },
    {
      id: 2,
      name: "Ahmed Hamouda",
      username: "ahennaki",
      email: "ennakiahmed96@gmail.com",
      role: "FullUser",
      isActive: true,
      initials: "AH",
    },
    {
      id: 3,
      name: "Ahmed Ennaki",
      username: "ahmed",
      email: "ahmed.hamudatech@gmail.com",
      role: "Admin",
      isActive: true,
      initials: "AE",
    },
  ]);

  // Handlers for user operations
  const handleEdit = (user: UserItem) => {
    console.log("Edit user", user);
  };

  const handleDelete = (user: UserItem) => {
    console.log("Delete user", user);
  };

  const handleViewLogs = (user: UserItem) => {
    console.log("View user logs", user);
  };

  const handleEditEmail = (user: UserItem) => {
    console.log("Edit user email", user);
  };

  const handleToggleStatus = (user: UserItem, isActive: boolean) => {
    console.log("Toggle user status", user, isActive);
    // Update the user in state
    setUsers(users.map((u) => (u.id === user.id ? { ...u, isActive } : u)));
  };

  const handleRoleChange = (user: UserItem, role: string) => {
    console.log("Change user role", user, role);
    // Update the user in state
    setUsers(users.map((u) => (u.id === user.id ? { ...u, role } : u)));
  };

  return (
    <UserTable
      users={users}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onViewLogs={handleViewLogs}
      onEditEmail={handleEditEmail}
      onToggleStatus={handleToggleStatus}
      onRoleChange={handleRoleChange}
      isSimpleUser={false}
    />
  );
}

// Example usage in the main User Management page:
/*
<UserTable
  users={filteredUsers}
  onEdit={handleEditUser}
  onDelete={handleDeleteUser}
  onViewLogs={handleViewUserLogs}
  onEditEmail={handleEditUserEmail}
  onToggleStatus={handleToggleUserStatus}
  onRoleChange={handleUserRoleChange}
  isSimpleUser={false}
/>
*/
