
import { useState } from 'react';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { DocumentType } from '@/models/document';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface SubTypeCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  documentTypes: DocumentType[];
}

const SubTypeCreateDialog = ({
  open,
  onOpenChange,
  onSubmit,
  documentTypes,
}: SubTypeCreateDialogProps) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [documentTypeId, setDocumentTypeId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  );
  const [isActive, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setName('');
    setDescription('');
    setDocumentTypeId(null);
    setStartDate(new Date());
    setEndDate(new Date(new Date().setFullYear(new Date().getFullYear() + 1)));
    setIsActive(true);
    setErrors({});
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!documentTypeId) {
      newErrors.documentTypeId = 'Document type is required';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!endDate) {
      newErrors.endDate = 'End date is required';
    }

    if (startDate && endDate && startDate >= endDate) {
      newErrors.dateRange = 'Start date must be before end date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit({
        name,
        description,
        documentTypeId,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        isActive,
      });
      resetForm();
    }
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0f1642] border-blue-900/50 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Subtype</DialogTitle>
          <DialogDescription className="text-blue-300">
            Create a new subtype for document classification.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name" className="text-blue-300">
              Name *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0a1033] border-blue-900/50 text-white"
              placeholder="Subtype name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-blue-300">
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#0a1033] border-blue-900/50 text-white"
              placeholder="Subtype description"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="documentType" className="text-blue-300">
              Document Type *
            </Label>
            <Select
              value={documentTypeId ? String(documentTypeId) : ''}
              onValueChange={(value) => setDocumentTypeId(parseInt(value))}
            >
              <SelectTrigger id="documentType" className="bg-[#0a1033] border-blue-900/50 text-white">
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent className="bg-[#0a1033] border-blue-900/50 text-white">
                {documentTypes.map((type) => (
                  <SelectItem key={type.id} value={String(type.id)}>
                    {type.typeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.documentTypeId && <p className="text-red-500 text-sm">{errors.documentTypeId}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate" className="text-blue-300">
                Start Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="startDate"
                    variant="outline"
                    className="bg-[#0a1033] border-blue-900/50 text-white justify-start"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-[#0a1033] border-blue-900/50 text-white">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate}</p>}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate" className="text-blue-300">
                End Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="endDate"
                    variant="outline"
                    className="bg-[#0a1033] border-blue-900/50 text-white justify-start"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="bg-[#0a1033] border-blue-900/50 text-white">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-red-500 text-sm">{errors.endDate}</p>}
            </div>
            {errors.dateRange && <p className="text-red-500 text-sm col-span-2">{errors.dateRange}</p>}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="isActive" className="text-white">Active</Label>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={handleClose}
            className="border-blue-900/50 text-blue-400 hover:bg-blue-900/30"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Create Subtype
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubTypeCreateDialog;
