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
import adminService, { CreateUserRequest } from "@/services/adminService";
import { Eye, EyeOff, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

// Password validation schema
const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters." })
  .refine((value) => /[A-Z]/.test(value), {
    message: "Password must contain at least one uppercase letter.",
  })
  .refine((value) => /[a-z]/.test(value), {
    message: "Password must contain at least one lowercase letter.",
  })
  .refine((value) => /[0-9]/.test(value), {
    message: "Password must contain at least one number.",
  })
  .refine((value) => /[^A-Za-z0-9]/.test(value), {
    message: "Password must contain at least one special character.",
  });

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  passwordHash: passwordSchema,
  roleName: z.enum(["Admin", "FullUser", "SimpleUser"], {
    required_error: "Please select a user role.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (userData: CreateUserRequest) => Promise<void>;
  roles?: Array<{ roleId: number; roleName: string } | string>;
}

export function CreateUserDialog({
  open,
  onOpenChange,
  onSubmit,
  roles = [],
}: CreateUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  const steps = [
    { title: "Basic Information", description: "Enter user account details" },
    { title: "Personal Information", description: "Enter first and last name" },
    { title: "Security", description: "Set password and role" },
    { title: "Review", description: "Review all information" },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      passwordHash: "",
      roleName: "SimpleUser",
    },
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const nextStep = () => {
    const fieldsToValidate =
      currentStep === 0
        ? ["email", "username"]
        : currentStep === 1
        ? ["firstName", "lastName"]
        : currentStep === 2
        ? ["passwordHash", "roleName"]
        : [];

    if (fieldsToValidate.length > 0) {
      form.trigger(fieldsToValidate as any).then((isValid) => {
        if (isValid) {
          setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
        }
      });
    } else {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const userData: CreateUserRequest = {
        email: values.email,
        username: values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        passwordHash: values.passwordHash,
        roleName: values.roleName,
      };

      if (onSubmit) {
        await onSubmit(userData);
      } else {
        await adminService.createUser(userData);
        toast.success("User created successfully");
      }

      form.reset();
      setCurrentStep(0);
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.response?.data || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = () => {
    const password = form.watch("passwordHash");
    if (!password) return { strength: 0, text: "", color: "bg-gray-200" };

    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;

    const strengthText = [
      "Very Weak",
      "Weak",
      "Fair",
      "Good",
      "Strong",
      "Very Strong",
    ][strength];
    const colors = [
      "bg-red-500",
      "bg-red-400",
      "bg-yellow-400",
      "bg-yellow-300",
      "bg-green-400",
      "bg-green-500",
    ];

    return {
      strength: (strength / 5) * 100,
      text: strengthText,
      color: colors[strength],
    };
  };

  // Helper function to safely get role name
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

  const passwordStrength = getPasswordStrength();

  // Theme-specific styling
  const dialogContentClass = isLightMode
    ? "bg-white border-gray-200 text-gray-900 shadow-xl"
    : "bg-[#0a1033] border-blue-900/30 text-white backdrop-blur-md";

  const dialogTitleClass = isLightMode
    ? "text-xl text-gray-900"
    : "text-xl text-white";

  const dialogDescriptionClass = isLightMode
    ? "text-gray-600"
    : "text-blue-300";

  const stepActiveClass = isLightMode
    ? "text-blue-600"
    : "text-blue-400";

  const stepInactiveClass = isLightMode
    ? "text-gray-400"
    : "text-gray-500";

  const stepActiveCircle = isLightMode
    ? "bg-blue-500 text-white"
    : "bg-blue-600 text-white";

  const stepCurrentCircle = isLightMode
    ? "bg-blue-400 text-white"
    : "bg-blue-500 text-white";

  const stepInactiveCircle = isLightMode
    ? "bg-gray-200 text-gray-600"
    : "bg-gray-700";

  const stepConnectorActive = isLightMode
    ? "bg-blue-400"
    : "bg-blue-600";

  const stepConnectorInactive = isLightMode
    ? "bg-gray-200"
    : "bg-gray-700";

  const formLabelClass = isLightMode
    ? "text-gray-700"
    : "text-blue-200";

  const formControlClass = isLightMode
    ? "bg-white border-gray-300 focus-visible:ring-blue-500"
    : "bg-blue-950/50 border-blue-900/50 text-white";

  const formDescriptionClass = isLightMode
    ? "text-gray-500"
    : "text-blue-300";

  const buttonPrimaryClass = isLightMode
    ? "bg-blue-500 hover:bg-blue-600 text-white"
    : "bg-blue-600 hover:bg-blue-700 text-white";

  const buttonSecondaryClass = isLightMode
    ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
    : "bg-blue-900/20 border-blue-900/50 text-blue-300";

  const selectTriggerClass = isLightMode
    ? "bg-white border-gray-300 text-gray-900"
    : "bg-blue-950/50 border-blue-900/50 text-white";

  const selectContentClass = isLightMode
    ? "bg-white border-gray-200"
    : "bg-[#0a1033] border-blue-900/30";

  const selectItemClass = isLightMode
    ? "text-gray-800 hover:bg-gray-100"
    : "text-white hover:bg-blue-900/20";
  
  const passwordToggleClass = isLightMode
    ? "text-gray-500 hover:text-gray-700"
    : "text-blue-400 hover:text-blue-200";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[550px] max-h-[85vh] overflow-y-auto ${dialogContentClass}`}>
        <DialogHeader className="mb-2">
          <DialogTitle className={dialogTitleClass}>Create User</DialogTitle>
          <DialogDescription className={dialogDescriptionClass}>
            Create a new user with specific role and permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <div className="flex justify-between mb-2">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center ${
                  idx <= currentStep ? stepActiveClass : stepInactiveClass
                }`}
                style={{ width: `${100 / steps.length}%` }}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 
                  ${
                    idx < currentStep
                      ? stepActiveCircle
                      : idx === currentStep
                      ? stepCurrentCircle
                      : stepInactiveCircle
                  }`}
                >
                  {idx < currentStep ? <Check size={16} /> : idx + 1}
                </div>
                <div className="text-xs text-center hidden md:block">
                  {step.title}
                </div>
              </div>
            ))}
          </div>

          <div className="flex mb-6">
            {steps.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 ${
                  idx < currentStep
                    ? stepConnectorActive
                    : stepConnectorInactive
                } ${idx === 0 ? "rounded-l" : ""} ${
                  idx === steps.length - 1 ? "rounded-r" : ""
                }`}
              ></div>
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {currentStep === 0 && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={formLabelClass}>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="user@example.com"
                          {...field}
                          className={formControlClass}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormDescription className={formDescriptionClass}>
                        This email will be used for login and notifications.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={formLabelClass}>Username</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username"
                          {...field}
                          className={formControlClass}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormDescription className={formDescriptionClass}>
                        Choose a unique username for the account.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {currentStep === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={formLabelClass}>First Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John"
                          {...field}
                          className={formControlClass}
                          autoComplete="off"
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
                      <FormLabel className={formLabelClass}>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Doe"
                          {...field}
                          className={formControlClass}
                          autoComplete="off"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {currentStep === 2 && (
              <>
                <FormField
                  control={form.control}
                  name="passwordHash"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={formLabelClass}>Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            className={formControlClass}
                            {...field}
                            autoComplete="new-password"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 ${passwordToggleClass}`}
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>

                      <div className="mt-2 space-y-2">
                        <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className={`h-full ${passwordStrength.color}`}
                            style={{ width: `${passwordStrength.strength}%` }}
                          ></div>
                        </div>

                        {passwordStrength.text && (
                          <p className={`text-xs ${formDescriptionClass}`}>
                            Password strength: {passwordStrength.text}
                          </p>
                        )}

                        <ul className={`text-xs space-y-1 ${formDescriptionClass}`}>
                          <li className="flex items-center space-x-2">
                            <span
                              className={`h-2 w-2 rounded-full inline-block ${
                                /[A-Z]/.test(field.value)
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></span>
                            <span>One uppercase letter</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span
                              className={`h-2 w-2 rounded-full inline-block ${
                                /[a-z]/.test(field.value)
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></span>
                            <span>One lowercase letter</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span
                              className={`h-2 w-2 rounded-full inline-block ${
                                /[0-9]/.test(field.value)
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></span>
                            <span>One number</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span
                              className={`h-2 w-2 rounded-full inline-block ${
                                /[^A-Za-z0-9]/.test(field.value)
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></span>
                            <span>One special character</span>
                          </li>
                          <li className="flex items-center space-x-2">
                            <span
                              className={`h-2 w-2 rounded-full inline-block ${
                                field.value.length >= 8
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            ></span>
                            <span>At least 8 characters</span>
                          </li>
                        </ul>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roleName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={formLabelClass}>Role</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className={selectTriggerClass}>
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className={selectContentClass}>
                          {roles && roles.length > 0
                            ? roles.map((role, index) => (
                                <SelectItem
                                  key={index}
                                  value={getRoleName(role)}
                                  className={selectItemClass}
                                >
                                  {getRoleName(role)}
                                </SelectItem>
                              ))
                            : ["Admin", "FullUser", "SimpleUser"].map((role) => (
                                <SelectItem
                                  key={role}
                                  value={role}
                                  className={selectItemClass}
                                >
                                  {role}
                                </SelectItem>
                              ))}
                        </SelectContent>
                      </Select>
                      <FormDescription className={formDescriptionClass}>
                        This determines what permissions the user will have.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className={formLabelClass}>Email</h4>
                      <p className={formDescriptionClass}>{form.getValues("email")}</p>
                    </div>
                    <div>
                      <h4 className={formLabelClass}>Username</h4>
                      <p className={formDescriptionClass}>{form.getValues("username")}</p>
                    </div>
                    <div>
                      <h4 className={formLabelClass}>First Name</h4>
                      <p className={formDescriptionClass}>{form.getValues("firstName")}</p>
                    </div>
                    <div>
                      <h4 className={formLabelClass}>Last Name</h4>
                      <p className={formDescriptionClass}>{form.getValues("lastName")}</p>
                    </div>
                    <div>
                      <h4 className={formLabelClass}>Role</h4>
                      <p className={formDescriptionClass}>{form.getValues("roleName")}</p>
                    </div>
                    <div>
                      <h4 className={formLabelClass}>Password</h4>
                      <p className={formDescriptionClass}>••••••••</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-6">
              {currentStep > 0 ? (
                <Button
                  type="button"
                  onClick={prevStep}
                  className={buttonSecondaryClass}
                  variant="outline"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div></div>
              )}

              {currentStep < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className={buttonPrimaryClass}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  className={buttonPrimaryClass}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create User"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
