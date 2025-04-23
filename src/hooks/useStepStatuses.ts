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
    // Refetch every 10 seconds (more frequent than before)
    refetchInterval: 10000,
    // Important: set this to true to refetch in the background
    refetchOnWindowFocus: true,
    // Keep previous data using the correct property name for React Query v5+
    placeholderData: 'keepPreviousData',
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
      // Initial refetch on mount
      queryClient.invalidateQueries({ 
        queryKey: ['document-step-statuses', documentId],
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
