import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Action } from '@/models/action';

interface DeleteActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: Action | null;
  onConfirm: () => Promise<void>;
  theme?: string;
}

export function DeleteActionDialog({
  open,
  onOpenChange,
  action,
  onConfirm,
  theme = "dark",
}: DeleteActionDialogProps) {
  if (!action) return null;

  // Theme-specific classes
  const dialogContentClass = theme === "dark" 
    ? "bg-[#0f1642] border-blue-900/30 text-white" 
    : "bg-white border-gray-200 text-gray-900";
    
  const dialogTitleClass = theme === "dark" 
    ? "text-white" 
    : "text-gray-900";
    
  const dialogDescriptionClass = theme === "dark" 
    ? "text-blue-300" 
    : "text-gray-500";
    
  const cancelButtonClass = theme === "dark" 
    ? "bg-blue-950/50 border-blue-900/50 text-blue-400 hover:text-white hover:bg-blue-900/30" 
    : "bg-white border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50";
    
  const deleteButtonClass = theme === "dark" 
    ? "bg-red-600 hover:bg-red-700" 
    : "bg-red-500 hover:bg-red-600";

  const handleConfirm = async () => {
    await onConfirm();
    onOpenChange(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={dialogContentClass}>
        <AlertDialogHeader>
          <AlertDialogTitle className={dialogTitleClass}>Delete Action</AlertDialogTitle>
          <AlertDialogDescription className={dialogDescriptionClass}>
            Are you sure you want to delete the action "{action.title}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={cancelButtonClass}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className={deleteButtonClass}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
