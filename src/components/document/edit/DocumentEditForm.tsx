
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  Document,
  DocumentType,
  UpdateDocumentRequest
} from '@/models/document';
import documentService from '@/services/documentService';
import documentTypeService from '@/services/documentTypeService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface DocumentEditFormProps {
  document: Document;
  documentTypes?: DocumentType[];
  isLoading?: boolean;
  isSubmitting?: boolean;
  onSubmit: (documentData: UpdateDocumentRequest) => Promise<void>;
  onCancel: () => void;
}

export function DocumentEditForm({
  document,
  documentTypes = [],
  isLoading = false,
  isSubmitting = false,
  onSubmit,
  onCancel
}: DocumentEditFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    document?.docDate ? new Date(document.docDate) : undefined
  );
  const [availableTypes, setAvailableTypes] = useState<DocumentType[]>(documentTypes);

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<UpdateDocumentRequest>({
    defaultValues: {
      title: document?.title || '',
      content: document?.content || '',
      docDate: document?.docDate || new Date().toISOString(),
      status: document?.status || 0,
      typeId: document?.typeId || 1
    }
  });

  useEffect(() => {
    // Load document types if not provided
    if (documentTypes.length === 0) {
      const loadDocumentTypes = async () => {
        try {
          const types = await documentTypeService.getAllDocumentTypes();
          setAvailableTypes(types);
        } catch (error) {
          console.error('Failed to load document types:', error);
          toast.error('Failed to load document types');
        }
      };
      
      loadDocumentTypes();
    }
    
    // Update form when document changes
    if (document) {
      setValue('title', document.title);
      setValue('content', document.content);
      setValue('docDate', document.docDate);
      setValue('status', document.status);
      setValue('typeId', document.typeId);
      
      if (document.docDate) {
        setSelectedDate(new Date(document.docDate));
      }
    }
  }, [document, documentTypes, setValue]);

  const handleFormSubmit = (data: UpdateDocumentRequest) => {
    // Ensure docDate is set from the calendar if available
    if (selectedDate) {
      data.docDate = selectedDate.toISOString();
    }
    
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="title">Document Title</Label>
          <Input
            id="title"
            placeholder="Enter document title"
            {...register('title', { required: 'Title is required' })}
            disabled={isLoading || isSubmitting}
          />
          {errors.title && (
            <p className="text-sm text-red-500">{errors.title.message}</p>
          )}
        </div>

        <div className="grid gap-3">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Document content"
            className="min-h-[120px]"
            {...register('content')}
            disabled={isLoading || isSubmitting}
          />
        </div>

        <div className="grid gap-3">
          <Label htmlFor="docDate">Document Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="docDate"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left",
                  !selectedDate && "text-muted-foreground"
                )}
                disabled={isLoading || isSubmitting}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="typeId">Document Type</Label>
          <Select
            defaultValue={document?.typeId?.toString()}
            onValueChange={(value) => setValue('typeId', parseInt(value))}
            disabled={isLoading || isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {availableTypes && availableTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.typeName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="status">Status</Label>
          <Select
            defaultValue={document?.status?.toString()}
            onValueChange={(value) => setValue('status', parseInt(value))}
            disabled={isLoading || isSubmitting}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Draft</SelectItem>
              <SelectItem value="1">In Progress</SelectItem>
              <SelectItem value="2">Completed</SelectItem>
              <SelectItem value="3">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || isLoading}>
          {isSubmitting ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
