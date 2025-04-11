import { useState, useEffect } from 'react';
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
import { Ligne } from '@/models/document';

const formSchema = z.object({
  title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
  description: z.string().optional(),
  amount: z.string().refine((value) => !isNaN(parseFloat(value)), {
    message: 'Amount must be a number',
  }),
  article: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditLigneDialogProps {
  ligne: Ligne;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function EditLigneDialog({
  ligne,
  open,
  onOpenChange,
  onSuccess,
}: EditLigneDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState(ligne.title);
  const [description, setDescription] = useState(ligne.description || '');
  const [amount, setAmount] = useState(ligne.amount.toString());
  const [article, setArticle] = useState(ligne.article || '');

  useEffect(() => {
    if (ligne) {
      setTitle(ligne.title);
      setDescription(ligne.description || '');
      setAmount(ligne.amount.toString());
      setArticle(ligne.article || '');
    }
  }, [ligne]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    await ligneService.updateLigne(ligne.id, {
      title,
      description,
      amount: parseFloat(amount),
      article,
      // Remove prix from here as it doesn't exist in UpdateLigneRequest
      orderIndex: ligne.orderIndex
    });
    
    toast.success('Ligne updated successfully');
    onOpenChange(false);
    onSuccess();
  } catch (error) {
    toast.error('Failed to update ligne');
    console.error(error);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Ligne</DialogTitle>
          <DialogDescription>
            Update the details for this Ligne.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ligne title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ligne description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ligne amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
            <FormItem>
              <FormLabel>Article</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ligne article"
                  value={article}
                  onChange={(e) => setArticle(e.target.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Ligne'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

