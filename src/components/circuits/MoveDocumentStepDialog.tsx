
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
import { ArrowRightFromLine, Loader2 } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);

  // Fetch circuit details
  const { data: circuitDetails, isLoading } = useQuery({
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
    setError(null);
    
    try {
      console.log("Moving document to step:", {
        documentId,
        circuitDetailId: parseInt(values.circuitDetailId)
      });
      
      await circuitService.moveDocumentToStep({
        documentId,
        circuitDetailId: parseInt(values.circuitDetailId),
      });
      
      toast.success('Document moved to new step successfully');
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      console.error("Error moving document:", error);
      const errorMessage = error?.response?.data || 'Failed to move document to new step';
      toast.error(errorMessage);
      setError(errorMessage);
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

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="p-3 rounded bg-red-900/20 border border-red-900/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              
              <FormField
                control={form.control}
                name="circuitDetailId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Select Step</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-[#111633] border-blue-900/30 text-white">
                          <SelectValue placeholder="Select a step" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[#111633] border-blue-900/30 text-white">
                        {circuitDetails?.map((detail) => (
                          <SelectItem 
                            key={detail.id} 
                            value={detail.id.toString()}
                            disabled={detail.id === currentStepId}
                          >
                            {detail.orderIndex + 1}. {detail.title}
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
                  className="border-blue-900/30 text-white hover:bg-blue-900/20"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 
                    <>Moving... <Loader2 className="ml-2 h-4 w-4 animate-spin" /></> : 
                    <>Move Document <ArrowRightFromLine className="ml-2 h-4 w-4" /></>
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
