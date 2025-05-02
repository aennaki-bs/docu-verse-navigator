import { useState } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useSettings } from "@/context/SettingsContext";
import { UpdateUserRequest } from "@/services/adminService";

// Form schema
const formSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  isActive: z.boolean(),
  roleName: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditUserDialogProps {
  user: {
    id: number;
    username: string;
    name: string;
    firstName: string;
    lastName: string;
    isActive: boolean;
    role:
      | string
      | { roleId?: number; roleName?: string; id?: number; name?: string };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (userId: number, data: UpdateUserRequest) => Promise<void>;
  roles: Array<
    { roleId?: number; roleName?: string; id?: number; name?: string } | string
  >;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSubmit,
  roles = [],
}: EditUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  // Helper function to get role name from role object
  const getRoleName = (role: any): string => {
    if (typeof role === "string") return role;
    if (role && typeof role === "object") {
      if ("roleName" in role) return role.roleName;
      if ("name" in role) return role.name;
    }
    return "Unknown";
  };

  // Get the initial role name
  const initialRoleName = getRoleName(user.role);

  // Set up form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: user.isActive,
      roleName: initialRoleName,
    },
  });

  // Handler for form submission
  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Only include changed fields in the update request
      const updateData: UpdateUserRequest = {};

      if (values.username !== user.username) {
        updateData.username = values.username;
      }

      if (values.firstName !== user.firstName) {
        updateData.firstName = values.firstName;
      }

      if (values.lastName !== user.lastName) {
        updateData.lastName = values.lastName;
      }

      if (values.isActive !== user.isActive) {
        updateData.isActive = values.isActive;
      }

      const currentRole = getRoleName(user.role);
      if (values.roleName !== currentRole) {
        updateData.roleName = values.roleName;
      }

      // If nothing changed, show message and close dialog
      if (Object.keys(updateData).length === 0) {
        toast.info("No changes were made");
        onOpenChange(false);
        return;
      }

      await onSubmit(user.id, updateData);
      toast.success("User updated successfully");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Failed to update user");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`sm:max-w-[500px] ${
          isLightMode
            ? "bg-white"
            : "bg-[#0a1033] border-blue-900/30 text-white backdrop-blur-md"
        }`}
      >
        <DialogHeader>
          <DialogTitle className={isLightMode ? "text-gray-900" : "text-white"}>
            Edit User
          </DialogTitle>
          <DialogDescription
            className={isLightMode ? "text-gray-500" : "text-blue-300"}
          >
            Update the user information below.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={isLightMode ? "text-gray-700" : "text-white"}
                  >
                    Username
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username"
                      {...field}
                      className={
                        isLightMode
                          ? "bg-white border-gray-300"
                          : "bg-[#111633] border-blue-900/50 text-white placeholder:text-blue-300/50"
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className={isLightMode ? "text-gray-700" : "text-white"}
                    >
                      First Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="First Name"
                        {...field}
                        className={
                          isLightMode
                            ? "bg-white border-gray-300"
                            : "bg-[#111633] border-blue-900/50 text-white placeholder:text-blue-300/50"
                        }
                      />
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
                    <FormLabel
                      className={isLightMode ? "text-gray-700" : "text-white"}
                    >
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Last Name"
                        {...field}
                        className={
                          isLightMode
                            ? "bg-white border-gray-300"
                            : "bg-[#111633] border-blue-900/50 text-white placeholder:text-blue-300/50"
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="roleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel
                    className={isLightMode ? "text-gray-700" : "text-white"}
                  >
                    Role
                  </FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger
                        className={
                          isLightMode
                            ? "bg-white border-gray-300"
                            : "bg-[#111633] border-blue-900/50 text-white"
                        }
                      >
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent
                      className={
                        isLightMode
                          ? "bg-white border-gray-200"
                          : "bg-[#0a1033] border-blue-900/50 text-white"
                      }
                    >
                      {roles && roles.length > 0
                        ? roles.map((role, index) => (
                            <SelectItem
                              key={index}
                              value={getRoleName(role)}
                              className={
                                isLightMode
                                  ? "hover:bg-gray-100"
                                  : "hover:bg-blue-900/30"
                              }
                            >
                              {getRoleName(role)}
                            </SelectItem>
                          ))
                        : ["Admin", "FullUser", "SimpleUser"].map((role) => (
                            <SelectItem
                              key={role}
                              value={role}
                              className={
                                isLightMode
                                  ? "hover:bg-gray-100"
                                  : "hover:bg-blue-900/30"
                              }
                            >
                              {role}
                            </SelectItem>
                          ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem
                  className={`flex flex-row items-center justify-between rounded-lg border p-4 
                  ${isLightMode ? "border-gray-200" : "border-blue-900/30"}`}
                >
                  <div className="space-y-0.5">
                    <FormLabel
                      className={isLightMode ? "text-gray-700" : "text-white"}
                    >
                      Active Status
                    </FormLabel>
                    <FormDescription
                      className={
                        isLightMode ? "text-gray-500" : "text-blue-300"
                      }
                    >
                      {field.value ? "User is active" : "User is inactive"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className={
                  isLightMode
                    ? "border-gray-300 text-gray-700"
                    : "border-blue-900/30 text-blue-300 hover:bg-blue-900/20"
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
