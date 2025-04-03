
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import adminService, { UserDto, UpdateUserRequest } from '@/services/adminService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  firstName: z.string().min(2, { message: 'First name is required' }),
  lastName: z.string().min(2, { message: 'Last name is required' }),
  roleName: z.enum(['Admin', 'FullUser', 'SimpleUser'], {
    required_error: 'Please select a role',
  }),
  isActive: z.boolean(),
  isEmailConfirmed: z.boolean(),
  passwordHash: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserDialogProps {
  user: UserDto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditUserDialog({ user, open, onOpenChange, onSuccess }: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper function to get the role name as a string
  const getRoleString = (role: string | { roleId?: number; roleName?: string }): string => {
    if (typeof role === 'string') {
      return role;
    }
    
    if (role && typeof role === 'object' && 'roleName' in role) {
      return role.roleName || 'Unknown';
    }
    
    return 'Unknown';
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      roleName: getRoleString(user.role) as 'Admin' | 'FullUser' | 'SimpleUser',
      isActive: user.isActive,
      isEmailConfirmed: user.isEmailConfirmed,
      passwordHash: '',
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (userData: UpdateUserRequest) => 
      adminService.updateUser(user.id, userData),
    onSuccess: () => {
      toast.success('User updated successfully');
      onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.response?.data || 'Failed to update user');
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const onSubmit = (data: FormValues) => {
    setIsSubmitting(true);
    
    // Only include fields that have changed or have values
    const updateData: UpdateUserRequest = {};
    
    if (data.username !== user.username) {
      updateData.username = data.username;
    }
    
    if (data.firstName !== user.firstName) {
      updateData.firstName = data.firstName;
    }
    
    if (data.lastName !== user.lastName) {
      updateData.lastName = data.lastName;
    }
    
    const currentRole = getRoleString(user.role);
    if (data.roleName !== currentRole) {
      updateData.roleName = data.roleName;
    }
    
    if (data.isActive !== user.isActive) {
      updateData.isActive = data.isActive;
    }
    
    if (data.isEmailConfirmed !== user.isEmailConfirmed) {
      updateData.isEmailConfirmed = data.isEmailConfirmed;
    }
    
    // Only include password if it's provided and not empty
    if (data.passwordHash && data.passwordHash.trim() !== '') {
      updateData.passwordHash = data.passwordHash;
    }
    
    // If no changes were made, inform the user
    if (Object.keys(updateData).length === 0) {
      toast.info('No changes were made');
      setIsSubmitting(false);
      onOpenChange(false);
      return;
    }
    
    updateUserMutation.mutate(updateData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information for {user.firstName} {user.lastName}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="passwordHash"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password (leave blank to keep current)</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="FullUser">Full User</SelectItem>
                      <SelectItem value="SimpleUser">Simple User</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="isEmailConfirmed"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Email Verified</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
