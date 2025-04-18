
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { DocumentStatus } from '@/models/documentCircuit';
import circuitService from '@/services/circuitService';

interface EditStepStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: DocumentStatus;
  documentId?: number;
  onSuccess: () => void;
}

export function EditStepStatusDialog({
  open,
  onOpenChange,
  status,
  documentId,
  onSuccess
}: EditStepStatusDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(status.title);
  const [isRequired, setIsRequired] = useState(status.isRequired);
  const [isComplete, setIsComplete] = useState(status.isComplete);

  const handleSubmit = async () => {
    if (!documentId) {
      toast.error('Document ID is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await circuitService.completeStatus({
        documentId,
        statusId: status.statusId,
        isComplete,
        comments: `Status '${title}' marked as ${isComplete ? 'complete' : 'incomplete'}`
      });

      toast.success('Status updated successfully');
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#0a1033] border-blue-900/30">
        <DialogHeader>
          <DialogTitle>Edit Status</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-[#060927] border-blue-900/30"
              disabled
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="required">Required</Label>
            <Switch
              id="required"
              checked={isRequired}
              onCheckedChange={setIsRequired}
              disabled
            />
          </div>
          
          <div className="flex items-center justify-between">
            <Label htmlFor="complete">Complete</Label>
            <Switch
              id="complete"
              checked={isComplete}
              onCheckedChange={setIsComplete}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-blue-900/10 border-blue-900/30 hover:bg-blue-900/20"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
