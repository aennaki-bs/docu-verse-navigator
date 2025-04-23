
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';
import { DocumentStatus } from '@/models/documentCircuit';

export function useStepStatuses(documentId: number) {
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

  return {
    statuses,
    isLoading,
    isError,
    error,
    refetch
  };
}
