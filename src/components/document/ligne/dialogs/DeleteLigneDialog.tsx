
import { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ligne } from '@/models/document';
import { toast } from 'sonner';
import ligneService from '@/services/ligneService';

export interface DeleteLigneDialogProps {
  ligne: Ligne;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export const DeleteLigneDialog = ({
  ligne,
  isOpen,
  onOpenChange,
  onSuccess
}: DeleteLigneDialogProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      await ligneService.deleteLigne(ligne.id);
      toast.success(`Line deleted successfully`);
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error deleting ligne:', error);
      toast.error('Failed to delete line');
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Line</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this line? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <p><strong>Line ID:</strong> {ligne.ligneKey}</p>
          <p><strong>Title:</strong> {ligne.title}</p>
          <p><strong>Amount:</strong> {ligne.prix}</p>
        </div>
        
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button 
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
