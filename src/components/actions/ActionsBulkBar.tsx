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
}

export function ActionsBulkBar({
  selectedCount,
  onAssignToStep,
  onDelete,
}: ActionsBulkBarProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-[#0a1033] border-t border-blue-900/50 shadow-lg p-4 flex items-center justify-between z-50">
        <div className="text-blue-300 font-medium">
          <span className="text-blue-200 font-semibold">{selectedCount}</span>{" "}
          actions selected
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="bg-blue-900/20 border-blue-900/40 text-blue-300 hover:text-blue-100 hover:bg-blue-900/40 transition-colors"
            onClick={onAssignToStep}
          >
            <Link className="w-4 h-4 mr-2" />
            Assign to Step
          </Button>
          <Button
            variant="outline"
            className="bg-red-900/20 border-red-900/40 text-red-400 hover:text-red-300 hover:bg-red-900/40 transition-colors"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Selected
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[#0f1642] border-blue-900/50 text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">
              Delete Actions
            </AlertDialogTitle>
            <AlertDialogDescription className="text-blue-300">
              Are you sure you want to delete {selectedCount} actions? This
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className="bg-transparent border-blue-800/40 text-blue-300 hover:bg-blue-800/20 hover:text-blue-200">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete();
                setShowDeleteDialog(false);
              }}
              className="bg-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 border border-red-900/50"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
