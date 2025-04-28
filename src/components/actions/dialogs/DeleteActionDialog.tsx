
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Action } from '@/models/action';

interface DeleteActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: Action | null;
  onConfirm: () => void;
}

export function DeleteActionDialog({
  open,
  onOpenChange,
  action,
  onConfirm,
}: DeleteActionDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#0f1642] text-white border-blue-900/30">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Action</AlertDialogTitle>
          <AlertDialogDescription className="text-blue-200">
            Are you sure you want to delete the action "{action?.title}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-blue-900/30">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
