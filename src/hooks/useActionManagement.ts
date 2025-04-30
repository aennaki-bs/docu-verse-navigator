import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Action, ActionForm } from '@/models/action';
import { actionService } from '@/services/actionService';
import { toast } from '@/components/ui/use-toast';

export function useActionManagement() {
  const queryClient = useQueryClient();
  const queryKey = ['actions'];

  const { data: actions = [], isLoading } = useQuery({
    queryKey,
    queryFn: actionService.getActions,
  });

  const createActionMutation = useMutation({
    mutationFn: actionService.createAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: 'Success',
        description: 'Action created successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to create action: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateActionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ActionForm }) =>
      actionService.updateAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: 'Success',
        description: 'Action updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update action: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteActionMutation = useMutation({
    mutationFn: actionService.deleteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: 'Success',
        description: 'Action deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete action: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const toggleActionStatusMutation = useMutation({
    mutationFn: actionService.toggleActionStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: 'Success',
        description: 'Action status updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update action status: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    actions,
    isLoading,
    createAction: createActionMutation.mutateAsync,
    updateAction: updateActionMutation.mutateAsync,
    deleteAction: deleteActionMutation.mutateAsync,
    toggleActionStatus: toggleActionStatusMutation.mutateAsync,
  };
}
