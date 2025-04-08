
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const formSchema = z.object({
  descriptif: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function StepTwoDescription() {
  const { formData, setCircuitData, nextStep, prevStep } = useCircuitForm();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      descriptif: formData.descriptif || '',
    },
  });

  const onSubmit = (values: FormValues) => {
    setCircuitData({
      descriptif: values.descriptif || '',
    });
    nextStep();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="descriptif"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Circuit Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter circuit description"
                  {...field}
                  value={field.value || ''}
                  className="min-h-[150px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={prevStep}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          
          <Button type="submit">
            Next Step <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
