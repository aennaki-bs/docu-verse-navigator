
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ActionForm, Action } from '@/models/action';
import { useActionManagement } from '@/hooks/useActionManagement';

interface ActionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: ActionForm) => void;
  action?: Action;
}

export function ActionFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  action 
}: ActionFormDialogProps) {
  const { createAction, updateAction } = useActionManagement();
  const form = useForm<ActionForm>({
    defaultValues: {
      title: action?.title || '',
      description: action?.description || '',
    },
  });

  const handleSubmit = async (data: ActionForm) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      // If no onSubmit provided, handle internally
      try {
        if (action) {
          await updateAction({ id: action.id, data });
        } else {
          await createAction(data);
        }
      } catch (error) {
        console.error('Error saving action:', error);
      }
    }
    form.reset();
    onOpenChange(false);
  };

  React.useEffect(() => {
    if (action && open) {
      form.reset({
        title: action.title,
        description: action.description || '',
      });
    } else if (!open) {
      form.reset();
    }
  }, [action, open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[#0f1642] text-white border-blue-900/30">
        <DialogHeader>
          <DialogTitle>{action ? 'Edit Action' : 'Create New Action'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register('title', { required: true })}
              className="bg-[#1a2765] border-blue-900/30"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...form.register('description')}
              className="bg-[#1a2765] border-blue-900/30 min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-blue-900/30"
            >
              Cancel
            </Button>
            <Button type="submit">
              {action ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
