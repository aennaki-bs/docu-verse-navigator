import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Action, CreateActionDto, UpdateActionDto } from '@/models/action';
import { actionService } from '@/services/actionService';
import { toast } from '@/components/ui/use-toast';

interface UseActionManagementProps {
  refreshTrigger?: number;
}

export function useActionManagement({ refreshTrigger = 0 }: UseActionManagementProps = {}) {
  const queryClient = useQueryClient();
  const queryKey = ['actions'];

  const { data: actions = [], isLoading } = useQuery({
    queryKey: [...queryKey, refreshTrigger],
    queryFn: actionService.getAllActions,
  });

  const createActionMutation = useMutation({
    mutationFn: actionService.createAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Action created",
        description: "The action has been created successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Failed to create action:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create action.",
      });
    },
  });

  const updateActionMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateActionDto }) =>
      actionService.updateAction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Action updated",
        description: "The action has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Failed to update action:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update action.",
      });
    },
  });

  const deleteActionMutation = useMutation({
    mutationFn: actionService.deleteAction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Action deleted",
        description: "The action has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Failed to delete action:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete action.",
      });
    },
  });

  const toggleActionStatusMutation = useMutation({
    mutationFn: actionService.toggleActionStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Status updated",
        description: "The action status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      console.error('Failed to update action status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update action status.",
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
