
import { useState, useEffect } from 'react';
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
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useHookForm } from 'react-hook-form';

const formSchema = z.object({
  typeName: z.string().min(1, "Type name is required"),
  typeAttr: z.string().optional(),
  typeKey: z.string().optional(),
  documentCounter: z.number().nonnegative().optional(),
});

type FormValues = z.infer<typeof formSchema>;

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isNew = !documentType;

  const form = useHookForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeName: documentType?.typeName || '',
      typeAttr: documentType?.typeAttr || '',
      typeKey: documentType?.typeKey || '',
      documentCounter: documentType?.documentCounter || 0,
    },
  });

  useEffect(() => {
    if (documentType) {
      form.reset({
        typeName: documentType.typeName,
        typeAttr: documentType.typeAttr || '',
        typeKey: documentType.typeKey || '',
        documentCounter: documentType.documentCounter || 0,
      });
    } else {
      form.reset({
        typeName: '',
        typeAttr: '',
        typeKey: '',
        documentCounter: 0,
      });
    }
  }, [documentType, form]);

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      if (isNew) {
        // Create new document type
        await documentTypeService.createDocumentType({
          typeName: values.typeName,
          typeAttr: values.typeAttr,
          typeKey: values.typeKey,
          documentCounter: values.documentCounter,
        });
        toast.success('Document type created successfully');
      } else if (documentType) {
        // Update existing document type
        await documentTypeService.updateDocumentType(documentType.id, {
          typeName: values.typeName,
          typeAttr: values.typeAttr,
        });
        toast.success('Document type updated successfully');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error: any) {
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="typeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter type name" required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="typeAttr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Attribute</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter type attribute" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isNew && (
              <>
                <FormField
                  control={form.control}
                  name="typeKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type Key</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter type key" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="documentCounter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Counter</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={(e) => field.onChange(Number(e.target.value))}
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
