
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminService, { UserDto } from '@/services/adminService';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { 
  Edit, 
  Trash, 
  MoreVertical, 
  Mail,
  Eye
} from 'lucide-react';
import { EditUserDialog } from './EditUserDialog';
import { EditUserEmailDialog } from './EditUserEmailDialog';
import { ViewUserLogsDialog } from './ViewUserLogsDialog';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export function UserTable() {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [editingUser, setEditingUser] = useState<UserDto | null>(null);
  const [editEmailUser, setEditEmailUser] = useState<UserDto | null>(null);
  const [viewingUserLogs, setViewingUserLogs] = useState<number | null>(null);
  const [deletingUser, setDeletingUser] = useState<number | null>(null);
  const [deleteMultipleOpen, setDeleteMultipleOpen] = useState(false);

  const { data: users, isLoading, isError, refetch } = useQuery({
    queryKey: ['admin-users'],
    queryFn: adminService.getAllUsers,
  });

  const handleUserEdited = () => {
    refetch();
    setEditingUser(null);
  };

  const handleUserEmailEdited = () => {
    refetch();
    setEditEmailUser(null);
  };

  const handleUserDeleted = () => {
    refetch();
    setDeletingUser(null);
    setSelectedUsers([]);
  };

  const handleMultipleDeleted = () => {
    refetch();
    setSelectedUsers([]);
    setDeleteMultipleOpen(false);
  };

  const handleSelectUser = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users?.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users?.map(user => user.id) || []);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-10">Loading users...</div>;
  }

  if (isError) {
    return <div className="text-red-500 py-10">Error loading users. Please try again.</div>;
  }

  // Helper function to safely get the role name as a string
  const getRoleString = (role: string | { roleId?: number; roleName?: string }): string => {
    if (typeof role === 'string') {
      return role;
    }
    
    if (role && typeof role === 'object' && 'roleName' in role) {
      return role.roleName || 'Unknown';
    }
    
    return 'Unknown';
  };

  return (
    <div>
      {selectedUsers.length > 0 && (
        <div className="mb-4 p-2 bg-slate-100 rounded flex items-center justify-between">
          <span>{selectedUsers.length} users selected</span>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => setDeleteMultipleOpen(true)}
            className="flex items-center gap-1"
          >
            <Trash className="h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedUsers.length > 0 && selectedUsers.length === users?.length}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-12"></TableHead>
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleSelectUser(user.id)}
                    aria-label={`Select user ${user.username}`}
                  />
                </TableCell>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={user.profilePicture} alt={user.username} />
                    <AvatarFallback>{user.firstName.charAt(0)}{user.lastName.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">
                  {user.firstName} {user.lastName}
                  <div className="text-xs text-gray-500">@{user.username}</div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleString(user.role) === 'Admin' ? 'default' : getRoleString(user.role) === 'FullUser' ? 'secondary' : 'outline'}>
                    {getRoleString(user.role)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.isActive ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                  ) : (
                    <Badge variant="destructive" className="bg-red-100 text-red-800">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEditingUser(user)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEditEmailUser(user)}>
                        <Mail className="mr-2 h-4 w-4" />
                        Update Email
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setViewingUserLogs(user.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Logs
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-red-600" 
                        onClick={() => setDeletingUser(user.id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {editingUser && (
        <EditUserDialog 
          user={editingUser} 
          open={!!editingUser} 
          onOpenChange={(open) => !open && setEditingUser(null)}
          onSuccess={handleUserEdited}
        />
      )}

      {editEmailUser && (
        <EditUserEmailDialog 
          user={editEmailUser}
          open={!!editEmailUser}
          onOpenChange={(open) => !open && setEditEmailUser(null)}
          onSuccess={handleUserEmailEdited}
        />
      )}

      {viewingUserLogs !== null && (
        <ViewUserLogsDialog
          userId={viewingUserLogs}
          open={viewingUserLogs !== null}
          onOpenChange={(open) => !open && setViewingUserLogs(null)}
        />
      )}

      {deletingUser !== null && (
        <DeleteConfirmDialog
          title="Delete User"
          description="Are you sure you want to delete this user? This action cannot be undone."
          open={deletingUser !== null}
          onOpenChange={(open) => !open && setDeletingUser(null)}
          onConfirm={async () => {
            try {
              if (deletingUser) {
                await adminService.deleteUser(deletingUser);
                toast.success('User deleted successfully');
                handleUserDeleted();
              }
            } catch (error) {
              toast.error('Failed to delete user');
              console.error(error);
            }
          }}
        />
      )}

      {deleteMultipleOpen && (
        <DeleteConfirmDialog
          title="Delete Multiple Users"
          description={`Are you sure you want to delete ${selectedUsers.length} users? This action cannot be undone.`}
          open={deleteMultipleOpen}
          onOpenChange={setDeleteMultipleOpen}
          onConfirm={async () => {
            try {
              await adminService.deleteMultipleUsers(selectedUsers);
              toast.success(`${selectedUsers.length} users deleted successfully`);
              handleMultipleDeleted();
            } catch (error) {
              toast.error('Failed to delete users');
              console.error(error);
            }
          }}
        />
      )}
    </div>
  );
}
