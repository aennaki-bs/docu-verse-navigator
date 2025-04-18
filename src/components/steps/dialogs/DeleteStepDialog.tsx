
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
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import stepService from '@/services/stepService';

interface DeleteStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  onSuccess: () => void;
  step?: Step | null;
  isBulk?: boolean;
  count?: number;
}

export const DeleteStepDialog = ({
  open,
  onOpenChange,
  onConfirm,
  onSuccess,
  step,
  isBulk = false,
  count = 0,
}: DeleteStepDialogProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!step && !isBulk) return;
    
    setIsDeleting(true);
    
    try {
      if (step) {
        await stepService.deleteStep(step.id);
        toast({
          title: "Step deleted",
          description: "The step has been deleted successfully",
        });
      } else if (isBulk && onConfirm) {
        onConfirm();
        toast({
          title: `${count} steps deleted`,
          description: "The selected steps have been deleted successfully",
        });
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error deleting step:', error);
      toast({
        title: "Error",
        description: "Failed to delete step. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-background border-destructive/20">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive">
            {isBulk ? `Delete ${count} Steps` : 'Delete Step'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBulk
              ? `Are you sure you want to delete ${count} selected steps? This action cannot be undone.`
              : step 
                ? `Are you sure you want to delete the step "${step.title}"? This action cannot be undone.`
                : 'Are you sure you want to delete this step? This action cannot be undone.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-blue-900/30" disabled={isDeleting}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
