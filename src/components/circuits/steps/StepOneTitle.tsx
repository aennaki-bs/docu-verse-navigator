
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCircuitForm } from '@/context/CircuitFormContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
});

type FormValues = z.infer<typeof formSchema>;

export default function StepOneTitle() {
  const { formData, setCircuitData, nextStep } = useCircuitForm();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: formData.title,
    },
  });

  const onSubmit = (values: FormValues) => {
    setCircuitData({
      title: values.title,
    });
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Circuit Title *</FormLabel>
              <FormControl>
                <Input placeholder="Enter circuit title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button type="submit">
            Next Step <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
