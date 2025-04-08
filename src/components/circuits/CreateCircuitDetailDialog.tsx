
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';
import adminService from '@/services/adminService';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  descriptif: z.string().optional(),
  orderIndex: z.coerce.number().int().nonnegative(),
  responsibleRoleId: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateCircuitDetailDialogProps {
  circuitId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateCircuitDetailDialog({
  circuitId,
  open,
  onOpenChange,
  onSuccess,
}: CreateCircuitDetailDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch existing circuit details to determine next order index
  const { data: circuitDetails } = useQuery({
    queryKey: ['circuit-details', circuitId],
    queryFn: () => circuitService.getCircuitDetailsByCircuitId(circuitId),
    enabled: open,
  });

  // Fetch roles for dropdown
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => adminService.getAllRoles(),
    enabled: open,
  });

  // Calculate the next order index
  const nextOrderIndex = circuitDetails && circuitDetails.length > 0 
    ? Math.max(...circuitDetails.map(d => d.orderIndex)) + 1 
    : 0;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      descriptif: '',
      orderIndex: nextOrderIndex || 0,
      responsibleRoleId: undefined,
    },
    values: {
      title: '',
      descriptif: '',
      orderIndex: nextOrderIndex || 0,
      responsibleRoleId: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await circuitService.createCircuitDetail({
        circuitId: circuitId,
        title: values.title,
        descriptif: values.descriptif || '',
        orderIndex: values.orderIndex,
        responsibleRoleId: values.responsibleRoleId 
          ? parseInt(values.responsibleRoleId) 
          : undefined,
      });
      
      form.reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to create circuit step');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Circuit Step</DialogTitle>
          <DialogDescription>
            Create a new step for this circuit
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter step title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descriptif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter step description"
                      {...field}
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="orderIndex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responsibleRoleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsible Role</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {roles?.map((role) => (
                          <SelectItem key={role.id} value={role.id.toString()}>
                            {role.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {isSubmitting ? 'Creating...' : 'Create Step'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
