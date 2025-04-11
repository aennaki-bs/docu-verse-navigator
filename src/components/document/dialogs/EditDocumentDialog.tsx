
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useForm as useHookForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import documentService from '@/services/documentService';
import documentTypeService from '@/services/documentTypeService';
import { Document, DocumentType } from '@/models/document';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from '@/components/ui/form';
import { useQuery } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  typeId: z.number(),
  documentAlias: z.string().optional(),
  docDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditDocumentDialogProps {
  document: Document;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditDocumentDialog({ 
  document,
  open, 
  onOpenChange, 
  onSuccess 
}: EditDocumentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: documentTypes = [], isLoading: isLoadingDocTypes } = useQuery({
    queryKey: ['documentTypes'],
    queryFn: documentTypeService.getAllDocumentTypes,
  });

  const form = useHookForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: document.title,
      content: document.content || '',
      typeId: document.documentType?.id || 0,
      documentAlias: document.documentAlias || '',
      docDate: document.docDate ? new Date(document.docDate).toISOString().split('T')[0] : '',
    },
  });

  // Update form when document changes
  useEffect(() => {
    if (document) {
      form.reset({
        title: document.title,
        content: document.content || '',
        typeId: document.documentType?.id || 0,
        documentAlias: document.documentAlias || '',
        docDate: document.docDate ? new Date(document.docDate).toISOString().split('T')[0] : '',
      });
    }
  }, [document, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await documentService.updateDocument(document.id, {
        title: values.title,
        content: values.content || '',
        typeId: values.typeId,
        documentAlias: values.documentAlias,
        docDate: values.docDate,
      });

      toast.success('Document updated successfully');
      onOpenChange(false);
      if (onSuccess) onSuccess();
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
            Update document information
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter document title" required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="documentAlias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Alias (Optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter document alias" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="typeId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Type</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))}
                    value={field.value.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {documentTypes.map((type: DocumentType) => (
                        <SelectItem key={type.id} value={type.id.toString()}>
                          {type.typeName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="docDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Content (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter document content"
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting || isLoadingDocTypes}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
