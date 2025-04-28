
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useStepManagement } from '@/hooks/useStepManagement';
import { useState } from 'react';

export interface DeleteStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stepId: number;
  stepTitle: string;
  documentId?: number; // Making this optional to maintain compatibility
  onSuccess: () => void;
  onConfirm?: () => void; // Adding this prop to match usages
  step?: any; // For backward compatibility
  isBulk?: boolean; // For bulk delete functionality
  count?: number; // For bulk delete count
}

export function DeleteStepDialog({
  open,
  onOpenChange,
  stepId,
  stepTitle,
  documentId,
  onSuccess,
  onConfirm,
}: DeleteStepDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { deleteStep } = useStepManagement();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // If onConfirm is provided, use that, otherwise use the hook
      if (onConfirm) {
        onConfirm();
      } else {
        await deleteStep(stepId);
      }
      onSuccess();
      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-[#0f1642] text-white border-blue-900/30">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Step</AlertDialogTitle>
          <AlertDialogDescription className="text-blue-200">
            Are you sure you want to delete the step "{stepTitle}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-blue-900/30" disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            className="bg-red-600 hover:bg-red-700" 
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
