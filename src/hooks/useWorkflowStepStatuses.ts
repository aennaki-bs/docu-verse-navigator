
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEffect } from 'react';
import api from '@/services/api';
import { DocumentStatus } from '@/models/documentCircuit';

export function useWorkflowStepStatuses(documentId: number) {
  const queryClient = useQueryClient();

  const { 
    data: workflowStatuses,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['document-workflow-statuses', documentId],
    queryFn: () => api.get(`/Workflow/document/${documentId}/step-statuses`).then(res => res.data),
    enabled: !!documentId,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    placeholderData: (previousData) => previousData ?? [],
    meta: {
      onSettled: (data, err) => {
        if (err) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'Failed to load workflow statuses.';
          console.error('Workflow statuses error:', err);
          toast.error(errorMessage);
        }
      }
    }
  });

  // Force a background refetch when the component mounts
  useEffect(() => {
    if (documentId) {
      queryClient.invalidateQueries({ 
        queryKey: ['document-workflow-statuses', documentId],
      });
    }
  }, [documentId, queryClient]);

  return {
    workflowStatuses,
    isLoading,
    isError,
    error,
    refetch
  };
}
