import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, Trash2 } from "lucide-react";
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
import { Action } from "@/models/action";

interface ActionsBulkBarProps {
  selectedCount: number;
  onAssignToStep: () => void;
  onDelete: () => void;
  theme?: string;
}

export function ActionsBulkBar({
  selectedCount,
  onAssignToStep,
  onDelete,
  theme = "dark",
}: ActionsBulkBarProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Theme-specific classes
  const bulkBarClass = theme === "dark"
    ? "bg-[#0a1033] border-blue-900/50 shadow-lg"
    : "bg-white border-gray-200 shadow-md";

  const selectedTextClass = theme === "dark"
    ? "text-blue-300 font-medium"
    : "text-gray-600 font-medium";

  const countClass = theme === "dark"
    ? "text-blue-200 font-semibold"
    : "text-blue-600 font-semibold";

  const assignBtnClass = theme === "dark"
    ? "bg-blue-900/20 border-blue-900/40 text-blue-300 hover:text-blue-100 hover:bg-blue-900/40"
    : "bg-blue-50 border-blue-200 text-blue-600 hover:text-blue-700 hover:bg-blue-100";

  const deleteBtnClass = theme === "dark"
    ? "bg-red-900/20 border-red-900/40 text-red-400 hover:text-red-300 hover:bg-red-900/40"
    : "bg-red-50 border-red-200 text-red-500 hover:text-red-600 hover:bg-red-100";

  const dialogContentClass = theme === "dark"
    ? "bg-[#0f1642] border-blue-900/50 text-white"
    : "bg-white border-gray-200 text-gray-900";

  const dialogTitleClass = theme === "dark"
    ? "text-xl text-white"
    : "text-xl text-gray-900";

  const dialogDescClass = theme === "dark"
    ? "text-blue-300"
    : "text-gray-500";

  const cancelBtnClass = theme === "dark"
    ? "bg-transparent border-blue-800/40 text-blue-300 hover:bg-blue-800/20 hover:text-blue-200"
    : "bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700";

  const confirmBtnClass = theme === "dark"
    ? "bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 border border-red-900/50"
    : "bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 border border-red-200";

  return (
    <>
      <div className={`fixed bottom-0 left-0 right-0 ${bulkBarClass} p-4 flex items-center justify-between z-50`}>
        <div className={selectedTextClass}>
          <span className={countClass}>{selectedCount}</span>{" "}
          actions selected
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className={`transition-colors ${assignBtnClass}`}
            onClick={onAssignToStep}
          >
            <Link className="w-4 h-4 mr-2" />
            Assign to Step
          </Button>
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
              Delete Actions
            </AlertDialogTitle>
            <AlertDialogDescription className={dialogDescClass}>
              Are you sure you want to delete {selectedCount} actions? This
              cannot be undone.
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
              className={confirmBtnClass}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
