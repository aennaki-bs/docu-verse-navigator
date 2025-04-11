import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import ligneService from '@/services/ligneService';
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

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  amount: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: 'Amount must be a number',
  }),
  article: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateLigneDialogProps {
  documentId: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export default function CreateLigneDialog({
  documentId,
  open,
  onOpenChange,
  onSuccess,
}: CreateLigneDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      await ligneService.createLigne({
        documentId,
        title: data.title,
        description: data.description,
        amount: parseFloat(data.amount),
        article: data.article,
      });
      toast.success('Ligne created successfully');
      reset();
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      toast.error('Failed to create ligne');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Ligne</DialogTitle>
          <DialogDescription>
            Add a new ligne to the document
          </DialogDescription>
        </DialogHeader>
        <Form>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={{ ...register }}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter ligne title" {...field} />
                  </FormControl>
                  <FormMessage>{errors.title?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={{ ...register }}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter ligne description" {...field} />
                  </FormControl>
                  <FormMessage>{errors.description?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={{ ...register }}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter amount" {...field} />
                  </FormControl>
                  <FormMessage>{errors.amount?.message}</FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={{ ...register }}
              name="article"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Article</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter article" {...field} />
                  </FormControl>
                  <FormMessage>{errors.article?.message}</FormMessage>
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
                {isSubmitting ? 'Creating...' : 'Create Ligne'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
