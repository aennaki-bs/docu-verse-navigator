import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import documentService from '@/services/documentService';
import documentTypeService from '@/services/documentTypeService';
import { Document, DocumentType } from '@/models/document';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  content: z.string().optional(),
  docDate: z.date(),
  documentAlias: z.string().optional(),
  typeId: z.string().min(1, { message: 'Please select a document type' }),
});

type FormData = z.infer<typeof formSchema>;

interface DocumentEditFormProps {
  document: Document;
  onSuccess: () => void;
}

export default function DocumentEditForm({ document, onSuccess }: DocumentEditFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [date, setDate] = useState<Date | undefined>(document ? new Date(document.docDate) : undefined);

  const { data: documentTypes } = useQuery({
    queryKey: ['documentTypes'],
    queryFn: documentTypeService.getAllDocumentTypes,
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: document.title,
      content: document.content,
      docDate: new Date(document.docDate),
      documentAlias: document.documentAlias || '',
      typeId: document.typeId.toString(),
    },
  });

  useEffect(() => {
    setDate(new Date(document.docDate));
  }, [document.docDate]);

  const updateDocument = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      setError('');

      await documentService.updateDocument(document.id, {
        title: formData.title,
        content: formData.content,
        documentAlias: formData.documentAlias || '',
        docDate: format(formData.docDate, 'yyyy-MM-dd'),
        status: document.status, // Keep existing status
        typeId: parseInt(formData.typeId)
      });

      toast.success('Document updated successfully');
      onSuccess();
      navigate('/documents');
    } catch (error: any) {
      setError(error?.message || 'Failed to update document');
      toast.error(error?.message || 'Failed to update document');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: FormData) => {
    updateDocument(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {error && <div className="text-red-500">{error}</div>}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter document title" {...field} />
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
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter document content" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="docDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Document Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      {date ? format(date, "yyyy-MM-dd") : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                      setDate(date)
                      field.onChange(date)
                    }}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="documentAlias"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Alias</FormLabel>
              <FormControl>
                <Input placeholder="Enter document alias" {...field} />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {documentTypes?.map((type) => (
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
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Update Document'}
        </Button>
      </form>
    </Form>
  );
}
