import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Action, CreateActionDto, UpdateActionDto } from '@/models/action';

const createActionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
});

const updateActionSchema = createActionSchema;

interface ActionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  action: Action | null;
  onSubmit: (data: CreateActionDto | UpdateActionDto) => Promise<void>;
  theme?: string;
}

export function ActionFormDialog({ 
  open, 
  onOpenChange, 
  action, 
  onSubmit,
  theme = "dark"
}: ActionFormDialogProps) {
  const isEditing = !!action;
  const schema = isEditing ? updateActionSchema : createActionSchema;
  
  // Theme-specific classes
  const dialogContentClass = theme === "dark" 
    ? "bg-[#0f1642] border-blue-900/30 text-white" 
    : "bg-white border-gray-200 text-gray-900";

  const dialogTitleClass = theme === "dark" 
    ? "text-white" 
    : "text-gray-900";

  const dialogDescriptionClass = theme === "dark" 
    ? "text-blue-300" 
    : "text-gray-500";

  const labelClass = theme === "dark" 
    ? "text-blue-200" 
    : "text-gray-700";

  const inputClass = theme === "dark"
    ? "bg-blue-950/50 border-blue-900/50 text-white placeholder:text-blue-400/70 focus-visible:ring-blue-600 focus-visible:ring-offset-blue-950"
    : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-500 focus-visible:ring-blue-500 focus-visible:ring-offset-gray-100";

  const cancelButtonClass = theme === "dark" 
    ? "bg-blue-950/50 border-blue-900/50 text-blue-400 hover:text-white hover:bg-blue-900/30" 
    : "bg-white border-gray-200 text-blue-500 hover:text-blue-600 hover:bg-gray-50";

  const submitButtonClass = theme === "dark" 
    ? "bg-blue-600 hover:bg-blue-700" 
    : "bg-blue-500 hover:bg-blue-600";
  
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: action?.title || '',
      description: action?.description || '',
    },
  });

  const handleSubmit = async (data: CreateActionDto | UpdateActionDto) => {
    await onSubmit(data);
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-[425px] ${dialogContentClass}`}>
        <DialogHeader>
          <DialogTitle className={dialogTitleClass}>
            {action ? 'Edit Action' : 'Create Action'}
          </DialogTitle>
          <DialogDescription className={dialogDescriptionClass}>
            {action 
              ? 'Update the details of the existing action.' 
              : 'Create a new action by filling out the form below.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Title</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter title" 
                      {...field} 
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={labelClass}>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter description" 
                      {...field} 
                      className={inputClass}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className={cancelButtonClass}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className={submitButtonClass}
              >
                {action ? 'Update' : 'Create'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
