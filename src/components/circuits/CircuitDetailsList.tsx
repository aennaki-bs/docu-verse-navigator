
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import circuitService from '@/services/circuitService';

interface CircuitDetailsListProps {
  circuitId: number;
}

export default function CircuitDetailsList({ circuitId }: CircuitDetailsListProps) {
  const {
    data: circuitDetails,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['circuit-details', circuitId],
    queryFn: () => circuitService.getCircuitDetailsByCircuitId(circuitId)
  });

  const handleRetryLoad = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-4">
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex flex-col space-y-2">
            <span>Error loading circuit details</span>
            <span className="text-xs opacity-80">
              {error instanceof Error ? error.message : 'An unexpected error occurred'}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 w-full"
              onClick={handleRetryLoad}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!circuitDetails || circuitDetails.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">No steps found for this circuit.</p>
        <p className="text-sm text-muted-foreground mt-2">Add steps to define the workflow.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {circuitDetails.map((detail) => (
        <div key={detail.id} className="p-4 border rounded-md">
          <h3 className="font-medium">{detail.title}</h3>
          {detail.descriptif && (
            <p className="text-sm text-muted-foreground mt-1">{detail.descriptif}</p>
          )}
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-primary/10 rounded-full">
              Order: {detail.orderIndex}
            </span>
            {detail.responsibleRoleId && (
              <span className="text-xs px-2 py-1 bg-secondary/10 rounded-full">
                Role: {detail.responsibleRole?.name || detail.responsibleRoleId}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
