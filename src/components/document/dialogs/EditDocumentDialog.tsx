
import { useState } from 'react';
import { toast } from 'sonner';
import { Document, DocumentType, UpdateDocumentRequest } from '@/models/document';
import documentService from '@/services/documentService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

interface EditDocumentDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditDocumentDialog: React.FC<EditDocumentDialogProps> = ({
  document,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: UpdateDocumentRequest) => {
    setIsSubmitting(true);
    
    try {
      await documentService.updateDocument(document.id, data);
      toast.success('Document updated successfully');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error('Failed to update document');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Document</DialogTitle>
          <DialogDescription>
            Update the document information
          </DialogDescription>
        </DialogHeader>
        
        <Form>
          <form onSubmit={(e) => { 
            e.preventDefault();
            // This is a placeholder - in reality, you would gather form data here
            const mockData: UpdateDocumentRequest = {
              title: document.title,
              content: document.content,
              docDate: document.docDate,
              status: document.status,
              typeId: document.typeId
            };
            handleSubmit(mockData);
          }}>
            {/* Form fields would go here in a real implementation */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Document'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditDocumentDialog;
