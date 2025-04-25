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
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  circuitId: z.string().min(1, 'Please select a circuit'),
});

type FormValues = z.infer<typeof formSchema>;

interface AssignCircuitDialogProps {
  documentId: number;
  documentTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function AssignCircuitDialog({
  documentId,
  documentTitle,
  open,
  onOpenChange,
  onSuccess,
}: AssignCircuitDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: circuits, isLoading } = useQuery({
    queryKey: ['circuits'],
    queryFn: circuitService.getAllCircuits,
    enabled: open,
  });

  // Filter circuits to only include those that have steps
  const circuitsWithSteps = circuits?.filter(circuit => 
    circuit.steps && circuit.steps.length > 0
  );

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      circuitId: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const circuitId = parseInt(values.circuitId);
      
      // Check if the circuit is inactive and needs to be activated
      const selectedCircuit = circuits?.find(c => c.id === circuitId);
      if (selectedCircuit && !selectedCircuit.isActive) {
        // Activate the circuit before assigning
        await circuitService.updateCircuit(circuitId, {
          ...selectedCircuit,
          isActive: true
        });
        toast.success('Circuit has been activated');
      }

      // Assign document to circuit
      await circuitService.assignDocumentToCircuit({
        documentId,
        circuitId: circuitId,
      });
      
      toast.success('Document assigned to circuit successfully');
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to assign document to circuit');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Assign to Circuit</DialogTitle>
          <DialogDescription>
            Select a circuit for document: {documentTitle}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="circuitId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Circuit</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a circuit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {circuitsWithSteps?.map((circuit) => (
                        <SelectItem key={circuit.id} value={circuit.id.toString()}>
                          {circuit.circuitKey} - {circuit.title}
                          {!circuit.isActive && " (Inactive)"}
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
              <Button type="submit" disabled={isSubmitting || isLoading}>
                {isSubmitting ? 'Assigning...' : 'Assign to Circuit'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
