
import { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightFromLine } from 'lucide-react';

const formSchema = z.object({
  circuitDetailId: z.string().min(1, { message: 'Please select a step' }),
});

type FormValues = z.infer<typeof formSchema>;

interface MoveDocumentStepDialogProps {
  documentId: number;
  documentTitle: string;
  circuitId: number;
  currentStepId?: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function MoveDocumentStepDialog({
  documentId,
  documentTitle,
  circuitId,
  currentStepId,
  open,
  onOpenChange,
  onSuccess,
}: MoveDocumentStepDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch circuit details
  const { data: circuitDetails } = useQuery({
    queryKey: ['circuit-details', circuitId],
    queryFn: () => circuitService.getCircuitDetailsByCircuitId(circuitId),
    enabled: open && !!circuitId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      circuitDetailId: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await circuitService.moveDocumentToStep({
        documentId,
        circuitDetailId: parseInt(values.circuitDetailId),
      });
      
      toast.success('Document moved to new step successfully');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to move document to new step');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Move Document to Another Step</DialogTitle>
          <DialogDescription>
            Select a step to move "{documentTitle}" to
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="circuitDetailId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Step</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a step" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {circuitDetails?.map((detail) => (
                        <SelectItem 
                          key={detail.id} 
                          value={detail.id.toString()}
                          disabled={detail.id === currentStepId}
                        >
                          {detail.orderIndex}. {detail.title}
                          {detail.id === currentStepId ? ' (Current)' : ''}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Moving...' : 'Move Document'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
