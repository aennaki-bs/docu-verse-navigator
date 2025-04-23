
import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import { Calendar } from 'lucide-react';
import { SubType } from '@/models/subType';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

interface SubTypeEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subType: SubType;
  onSubmit: (data: any) => void;
  documentTypes: DocumentType[];
}

const SubTypeEditDialog = ({
  open,
  onOpenChange,
  subType,
  onSubmit,
  documentTypes,
}: SubTypeEditDialogProps) => {
  const [name, setName] = useState(subType.name);
  const [description, setDescription] = useState(subType.description);
  const [startDate, setStartDate] = useState<Date | undefined>(
    typeof subType.startDate === 'string'
      ? parseISO(subType.startDate)
      : subType.startDate
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    typeof subType.endDate === 'string'
      ? parseISO(subType.endDate)
      : subType.endDate
  );
  const [isActive, setIsActive] = useState(subType.isActive);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when subType changes
  useEffect(() => {
    setName(subType.name);
    setDescription(subType.description);
    setStartDate(
      typeof subType.startDate === 'string'
        ? parseISO(subType.startDate)
        : subType.startDate
    );
    setEndDate(
      typeof subType.endDate === 'string'
        ? parseISO(subType.endDate)
        : subType.endDate
    );
    setIsActive(subType.isActive);
  }, [subType]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
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
      const updatedData = {
        name,
        description,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        isActive,
      };
      onSubmit(updatedData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f1642] border-blue-900/50 text-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Subtype</DialogTitle>
          <DialogDescription className="text-blue-300">
            Update the subtype information. Document type cannot be changed.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="edit-name" className="text-blue-300">
              Name *
            </Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#0a1033] border-blue-900/50 text-white"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="edit-description" className="text-blue-300">
              Description
            </Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#0a1033] border-blue-900/50 text-white"
            />
          </div>

          <div className="grid gap-2">
            <Label className="text-blue-300">
              Document Type
            </Label>
            <Input
              value={subType.documentType?.typeName || `Type ID: ${subType.documentTypeId}`}
              disabled
              className="bg-[#0a1033]/50 border-blue-900/30 text-gray-400"
            />
            <p className="text-blue-400 text-xs">Document type cannot be changed</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-startDate" className="text-blue-300">
                Start Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="edit-startDate"
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
              <Label htmlFor="edit-endDate" className="text-blue-300">
                End Date *
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="edit-endDate"
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
              id="edit-isActive"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
            <Label htmlFor="edit-isActive" className="text-white">Active</Label>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="border-blue-900/50 text-blue-400 hover:bg-blue-900/30"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubTypeEditDialog;
