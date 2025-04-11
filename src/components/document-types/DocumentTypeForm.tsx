import { useState } from 'react';
import { toast } from 'sonner';
import documentTypeService from '@/services/documentTypeService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DocumentType } from '@/models/document';

interface DocumentTypeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentType?: DocumentType;
  onSuccess: () => void;
}

export function DocumentTypeForm({
  open,
  onOpenChange,
  documentType,
  onSuccess,
}: DocumentTypeFormProps) {
  const [typeName, setTypeName] = useState(documentType?.typeName || '');
  const [typeAttr, setTypeAttr] = useState(documentType?.typeAttr || '');
  const [typeKey, setTypeKey] = useState(documentType?.typeKey || '');
  const [documentCounter, setDocumentCounter] = useState(documentType?.documentCounter?.toString() || '0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const isNew = !documentType;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (isNew) {
        // Create new document type
        const newDocType: Partial<DocumentType> = {
          typeName,
          typeAttr,
          typeKey,
          documentCounter: parseInt(documentCounter)
        };
        await documentTypeService.createDocumentType(newDocType as DocumentType);
        toast.success('Document type created successfully');
      } else {
        // Update existing document type
        await documentTypeService.updateDocumentType(documentType.id, {
          ...documentType,
          typeName,
          typeAttr
        });
        toast.success('Document type updated successfully');
      }
      onSuccess();
    } catch (error: any) {
      setError(error.message || 'Failed to save document type');
      toast.error(error.message || 'Failed to save document type');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isNew ? 'Create' : 'Edit'} Document Type</DialogTitle>
          <DialogDescription>
            {isNew ? 'Add a new document type' : 'Update document type details'}
          </DialogDescription>
        </DialogHeader>
        <Form>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500">{error}</p>}
            <FormField
              control={{}}
              name="typeName"
              render={() => (
                <FormItem>
                  <FormLabel>Type Name</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={typeName}
                      onChange={(e) => setTypeName(e.target.value)}
                      placeholder="Enter type name"
                      required
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={{}}
              name="typeAttr"
              render={() => (
                <FormItem>
                  <FormLabel>Type Attribute</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      value={typeAttr}
                      onChange={(e) => setTypeAttr(e.target.value)}
                      placeholder="Enter type attribute"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isNew && (
              <>
                <FormField
                  control={{}}
                  name="typeKey"
                  render={() => (
                    <FormItem>
                      <FormLabel>Type Key</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          value={typeKey}
                          onChange={(e) => setTypeKey(e.target.value)}
                          placeholder="Enter type key"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={{}}
                  name="documentCounter"
                  render={() => (
                    <FormItem>
                      <FormLabel>Document Counter</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          value={documentCounter}
                          onChange={(e) => setDocumentCounter(e.target.value)}
                          placeholder="Enter document counter"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
