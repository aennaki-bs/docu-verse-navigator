
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
  actionId: z.string().min(1, { message: 'Please select an action' }),
  comments: z.string().min(3, { message: 'Comments must be at least 3 characters' }),
  isApproved: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

interface ProcessCircuitStepDialogProps {
  documentId: number;
  documentTitle: string;
  currentStep: string; // Title of the current step
  currentStepId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function ProcessCircuitStepDialog({
  documentId,
  documentTitle,
  currentStep,
  currentStepId,
  open,
  onOpenChange,
  onSuccess,
}: ProcessCircuitStepDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch available actions for this step
  const { data: actions, isLoading: isLoadingActions } = useQuery({
    queryKey: ['step-actions', currentStepId],
    queryFn: () => circuitService.getActionsByStepId(currentStepId),
    enabled: open && !!currentStepId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      actionId: '',
      comments: '',
      isApproved: true,
    },
  });

  useEffect(() => {
    // Reset form when dialog opens
    if (open) {
      form.reset({
        actionId: '',
        comments: '',
        isApproved: true,
      });
    }
  }, [open, form]);

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await circuitService.processCircuitStep({
        documentId,
        actionId: parseInt(values.actionId),
        comments: values.comments,
        isApproved: values.isApproved,
      });
      
      toast.success(`Document ${values.isApproved ? 'approved' : 'rejected'} successfully`);
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to process document');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveOrReject = (isApproved: boolean) => {
    form.setValue('isApproved', isApproved);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Process Document Step</DialogTitle>
          <DialogDescription>
            Document: {documentTitle}<br/>
            Current Step: {currentStep}
          </DialogDescription>
        </DialogHeader>

        {isLoadingActions ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="actionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Action</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-1 gap-2"
                      >
                        {actions?.map((action) => (
                          <div key={action.id} className="flex items-center space-x-2 rounded-md border p-3 border-gray-700">
                            <RadioGroupItem value={action.id.toString()} id={`action-${action.id}`} />
                            <Label htmlFor={`action-${action.id}`} className="flex-1">{action.title}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comments</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add your comments or feedback"
                        {...field}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isApproved"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex space-x-2 justify-center pt-4">
                      <Button
                        type="button"
                        className={`${field.value ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} flex-1`}
                        onClick={() => handleApproveOrReject(true)}
                      >
                        <CheckCircle className="mr-2 h-4 w-4" /> Approve
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        className={`${!field.value ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'} flex-1`}
                        onClick={() => handleApproveOrReject(false)}
                      >
                        <XCircle className="mr-2 h-4 w-4" /> Reject
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  disabled={isSubmitting}
                  className="border-gray-700 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={form.watch('isApproved') ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                >
                  {isSubmitting ? 
                    <>Processing... <Loader2 className="ml-2 h-4 w-4 animate-spin" /></> : 
                    form.watch('isApproved') ? 'Approve & Submit' : 'Reject & Submit'
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
