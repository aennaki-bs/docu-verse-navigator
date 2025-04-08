
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

interface EditCircuitDetailDialogProps {
  circuitDetail: CircuitDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function EditCircuitDetailDialog({
  circuitDetail,
  open,
  onOpenChange,
  onSuccess,
}: EditCircuitDetailDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch roles for dropdown
  const { data: roles } = useQuery({
    queryKey: ['roles'],
    queryFn: () => adminService.getAllRoles(),
    enabled: open,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: circuitDetail.title,
      descriptif: circuitDetail.descriptif || '',
      orderIndex: circuitDetail.orderIndex,
      responsibleRoleId: circuitDetail.responsibleRoleId?.toString(),
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      await circuitService.updateCircuitDetail(circuitDetail.id, {
        ...circuitDetail,
        title: values.title,
        descriptif: values.descriptif || '',
        orderIndex: values.orderIndex,
        responsibleRoleId: values.responsibleRoleId 
          ? parseInt(values.responsibleRoleId) 
          : undefined,
      });
      
      toast.success('Circuit step updated successfully');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to update circuit step');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Circuit Step</DialogTitle>
          <DialogDescription>
            Update the details for this circuit step
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-md p-3 bg-muted/50 mb-4">
          <div className="text-sm font-medium">Step Key</div>
          <div className="font-mono text-sm">{circuitDetail.circuitDetailKey}</div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                        <SelectItem value={undefined}>None</SelectItem>
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
                {isSubmitting ? 'Updating...' : 'Update Step'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
