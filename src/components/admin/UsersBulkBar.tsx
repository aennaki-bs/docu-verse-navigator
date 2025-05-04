import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserCog, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings } from "@/context/SettingsContext";

interface UsersBulkBarProps {
  selectedCount: number;
  onChangeRole: (role: string) => void;
  onDelete: () => void;
}

export function UsersBulkBar({
  selectedCount,
  onChangeRole,
  onDelete,
}: UsersBulkBarProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const { theme } = useSettings();
  const isLightMode = theme === "light";

  // Theme-specific classes
  const bulkBarClass = isLightMode
    ? "bg-white border-gray-200 shadow-md"
    : "bg-[#0a1033] border-blue-900/50 shadow-lg";

  const selectedTextClass = isLightMode
    ? "text-gray-600 font-medium"
    : "text-blue-300 font-medium";

  const countClass = isLightMode
    ? "text-blue-600 font-semibold"
    : "text-blue-200 font-semibold";

  const labelClass = isLightMode
    ? "text-gray-600"
    : "text-blue-300";

  const selectTriggerClass = isLightMode
    ? "bg-white border-gray-300 text-gray-900"
    : "bg-blue-950/50 border-blue-900/50 text-white";

  const selectContentClass = isLightMode
    ? "bg-white border-gray-200 text-gray-900"
    : "bg-[#0a1033] border-blue-900/30 text-white";

  const selectItemClass = isLightMode
    ? "hover:bg-gray-100"
    : "hover:bg-blue-900/20";

  const deleteBtnClass = isLightMode
    ? "bg-red-50 border-red-200 text-red-600 hover:text-red-700 hover:bg-red-100"
    : "bg-red-900/20 border-red-900/40 text-red-400 hover:text-red-300 hover:bg-red-900/40";

  const dialogContentClass = isLightMode
    ? "bg-white border-gray-200 text-gray-900 shadow-lg"
    : "bg-[#0f1642] border-blue-900/50 text-white";

  const dialogTitleClass = isLightMode
    ? "text-xl text-gray-900"
    : "text-xl text-white";

  const dialogDescClass = isLightMode
    ? "text-gray-600"
    : "text-blue-300";

  const cancelBtnClass = isLightMode
    ? "bg-white border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
    : "bg-transparent border-blue-800/40 text-blue-300 hover:bg-blue-800/20 hover:text-blue-200";

  const confirmDeleteBtnClass = isLightMode
    ? "bg-red-100 text-red-600 hover:bg-red-200 hover:text-red-700 border border-red-200"
    : "bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 border border-red-900/50";

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    onChangeRole(role);
  };

  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 ${bulkBarClass} border-t p-4 flex items-center justify-between z-50`}>
        <div className={selectedTextClass}>
          <span className={countClass}>{selectedCount}</span>{" "}
          users selected
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <span className={labelClass}>Change Role:</span>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className={`w-[120px] ${selectTriggerClass}`}>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent className={selectContentClass}>
                <SelectItem value="Admin" className={selectItemClass}>
                  Admin
                </SelectItem>
                <SelectItem value="Manager" className={selectItemClass}>
                  Manager
                </SelectItem>
                <SelectItem value="User" className={selectItemClass}>
                  User
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="outline"
            className={`transition-colors ${deleteBtnClass}`}
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className={dialogContentClass}>
          <AlertDialogHeader>
            <AlertDialogTitle className={dialogTitleClass}>
              Delete Users
            </AlertDialogTitle>
            <AlertDialogDescription className={dialogDescClass}>
              Are you sure you want to delete {selectedCount} users? This cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className={cancelBtnClass}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
              className={confirmDeleteBtnClass}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
