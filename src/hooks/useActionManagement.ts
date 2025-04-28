
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api from '@/services/api';
import { Action, CreateActionDto } from '@/models/action';

export function useActionManagement() {
  const queryClient = useQueryClient();

  const { data: actions = [], isLoading } = useQuery({
    queryKey: ['actions'],
    queryFn: () => api.get('/Action').then(res => res.data),
  });

  const { mutateAsync: createAction } = useMutation({
    mutationFn: (data: CreateActionDto) => api.post('/Action', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      toast.success('Action created successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to create action');
      console.error('Error creating action:', error);
    },
  });

  const { mutateAsync: deleteAction } = useMutation({
    mutationFn: (actionId: number) => api.delete(`/Action/${actionId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      toast.success('Action deleted successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to delete action');
      console.error('Error deleting action:', error);
    },
  });

  const { mutateAsync: updateAction } = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateActionDto }) => 
      api.put(`/Action/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
      toast.success('Action updated successfully');
    },
    onError: (error: any) => {
      toast.error('Failed to update action');
      console.error('Error updating action:', error);
    },
  });

  return {
    actions,
    isLoading,
    createAction,
    deleteAction,
    updateAction,
  };
}
