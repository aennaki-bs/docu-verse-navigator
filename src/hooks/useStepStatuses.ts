
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEffect } from 'react';
import circuitService from '@/services/circuitService';
import { DocumentStatus } from '@/models/documentCircuit';

export function useStepStatuses(documentId: number) {
  const queryClient = useQueryClient();

  const { 
    data: statuses,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['document-step-statuses', documentId],
    queryFn: () => circuitService.getStepStatuses(documentId),
    enabled: !!documentId,
    // Refetch every 30 seconds
    refetchInterval: 30000,
    meta: {
      onSettled: (data, err) => {
        if (err) {
          const errorMessage = err instanceof Error 
            ? err.message 
            : 'Failed to load step statuses.';
          console.error('Step statuses error:', err);
          toast.error(errorMessage);
        }
      }
    }
  });

  // Force a background refetch when the component mounts
  useEffect(() => {
    if (documentId) {
      queryClient.invalidateQueries({ 
        queryKey: ['document-step-statuses', documentId],
        type: 'inactive'
      });
    }
  }, [documentId, queryClient]);

  return {
    statuses,
    isLoading,
    isError,
    error,
    refetch
  };
}
