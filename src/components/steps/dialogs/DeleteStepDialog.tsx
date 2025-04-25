import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useStepManagement } from '@/hooks/useStepManagement';
import { AlertCircle } from 'lucide-react';

interface DeleteStepDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stepId: number;
  stepTitle: string;
  onSuccess?: () => void;
}

export function DeleteStepDialog({
  open,
  onOpenChange,
  stepId,
  stepTitle,
  onSuccess
}: DeleteStepDialogProps) {
  const { deleteStep, isDeleting } = useStepManagement();

  const handleDelete = async () => {
    if (!stepId) {
      console.error('Step ID is required for deletion');
      return;
    }

    try {
      await deleteStep(stepId);
      onOpenChange(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error deleting step:', error);
      // Error toast is handled by the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#070b28] border-blue-900/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-400">
            <AlertCircle className="h-5 w-5" />
            Delete Step
          </DialogTitle>
          <DialogDescription className="text-blue-300">
            Are you sure you want to delete the step "{stepTitle}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-red-950/20 border border-red-900/30 rounded-md p-3 text-sm text-red-300">
          <p>Warning: Deleting this step will:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Remove all associated statuses</li>
            <li>Affect documents currently in this step</li>
            <li>Break the workflow for documents using this circuit</li>
          </ul>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-blue-900/10 border-blue-900/30 hover:bg-blue-900/20"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700"
          >
            {isDeleting ? 'Deleting...' : 'Delete Step'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
