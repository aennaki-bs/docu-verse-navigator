import { useSettings } from "@/context/SettingsContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

type ConfirmationType = "delete" | "warning" | "info" | "success";

interface ConfirmationDialogProps {
  title: string;
  description: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  isLoading?: boolean;
}

export function ConfirmationDialog({
  title,
  description,
  open,
  onOpenChange,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "warning",
  isLoading = false,
}: ConfirmationDialogProps) {
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  const getIconAndColors = () => {
    if (isLightMode) {
      switch (type) {
        case "delete":
          return {
            icon: <AlertTriangle className="h-6 w-6 text-red-600" />,
            confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
            iconBgClass: "bg-red-50",
          };
        case "warning":
          return {
            icon: <AlertCircle className="h-6 w-6 text-amber-600" />,
            confirmButtonClass: "bg-amber-600 hover:bg-amber-700 text-white",
            iconBgClass: "bg-amber-50",
          };
        case "success":
          return {
            icon: <CheckCircle2 className="h-6 w-6 text-green-600" />,
            confirmButtonClass: "bg-green-600 hover:bg-green-700 text-white",
            iconBgClass: "bg-green-50",
          };
        case "info":
        default:
          return {
            icon: <HelpCircle className="h-6 w-6 text-blue-600" />,
            confirmButtonClass: "bg-blue-600 hover:bg-blue-700 text-white",
            iconBgClass: "bg-blue-50",
          };
      }
    } else {
      // Dark mode colors
      switch (type) {
        case "delete":
          return {
            icon: <AlertTriangle className="h-6 w-6 text-red-400" />,
            confirmButtonClass: "bg-red-600 hover:bg-red-700 text-white",
            iconBgClass: "bg-red-900/30",
          };
        case "warning":
          return {
            icon: <AlertCircle className="h-6 w-6 text-amber-400" />,
            confirmButtonClass: "bg-amber-600 hover:bg-amber-700 text-white",
            iconBgClass: "bg-amber-900/30",
          };
        case "success":
          return {
            icon: <CheckCircle2 className="h-6 w-6 text-green-400" />,
            confirmButtonClass: "bg-green-600 hover:bg-green-700 text-white",
            iconBgClass: "bg-green-900/30",
          };
        case "info":
        default:
          return {
            icon: <HelpCircle className="h-6 w-6 text-blue-400" />,
            confirmButtonClass: "bg-blue-600 hover:bg-blue-700 text-white",
            iconBgClass: "bg-blue-900/30",
          };
      }
    }
  };

  const { icon, confirmButtonClass, iconBgClass } = getIconAndColors();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          isLightMode
            ? "bg-white"
            : "bg-[#0a1033] border-blue-900/30 text-white"
        }
      >
        <DialogHeader className="flex gap-4 sm:gap-6">
          <div className={`p-3 rounded-full ${iconBgClass}`}>{icon}</div>
          <div className="flex-1">
            <DialogTitle
              className={isLightMode ? "text-gray-900" : "text-white"}
            >
              {title}
            </DialogTitle>
            <DialogDescription
              className={isLightMode ? "text-gray-500" : "text-blue-300"}
            >
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter className="gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className={
              isLightMode
                ? "border-gray-300 text-gray-700 hover:bg-gray-50"
                : "border-blue-900/30 text-blue-300 hover:bg-blue-900/20"
            }
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            className={confirmButtonClass}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
