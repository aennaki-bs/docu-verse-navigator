
import { useState } from 'react';
import { toast } from 'sonner';
import { DocumentType, CreateDocumentRequest } from '@/models/document';
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

interface CreateDocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const CreateDocumentDialog: React.FC<CreateDocumentDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (data: CreateDocumentRequest) => {
    setIsSubmitting(true);
    
    try {
      await documentService.createDocument(data);
      toast.success('Document created successfully');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error creating document:', error);
      toast.error('Failed to create document');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
          <DialogDescription>
            Add a new document to your collection
          </DialogDescription>
        </DialogHeader>
        
        <Form>
          <form onSubmit={(e) => { 
            e.preventDefault();
            // This is a placeholder - in reality, you would gather form data here
            const mockData: CreateDocumentRequest = {
              title: 'Sample Document',
              docDate: new Date().toISOString(),
              status: 0,
              typeId: 1
            };
            handleSubmit(mockData);
          }}>
            {/* Form fields would go here in a real implementation */}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating...' : 'Create Document'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDocumentDialog;
