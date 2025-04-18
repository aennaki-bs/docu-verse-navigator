
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, AlertCircle, ArrowLeft } from 'lucide-react';
import circuitService from '@/services/circuitService';
import { StatusTable } from '@/components/statuses/StatusTable';
import { StatusFormDialog } from '@/components/statuses/dialogs/StatusFormDialog';
import { DeleteStatusDialog } from '@/components/statuses/dialogs/DeleteStatusDialog';
import { useAuth } from '@/context/AuthContext';
import { DocumentStatus } from '@/models/documentCircuit';
import { useStepStatuses } from '@/hooks/useStepStatuses';

export default function StepStatusesPage() {
  const { circuitId, stepId } = useParams<{ circuitId: string; stepId: string }>();
  const { user } = useAuth();
  const isSimpleUser = user?.role === 'SimpleUser';
  
  const [apiError, setApiError] = useState('');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | null>(null);
  
  // Fetch circuit details
  const { 
    data: circuit,
    isLoading: isCircuitLoading,
    isError: isCircuitError
  } = useQuery({
    queryKey: ['circuit', circuitId],
    queryFn: () => circuitService.getCircuitById(Number(circuitId)),
    enabled: !!circuitId
  });

  // Fetch step details
  const {
    data: steps = [],
    isLoading: isStepsLoading,
    isError: isStepsError
  } = useQuery({
    queryKey: ['circuit-steps', circuitId],
    queryFn: () => circuitService.getCircuitDetailsByCircuitId(Number(circuitId)),
    enabled: !!circuitId
  });

  // Find the current step
  const currentStep = steps.find(s => s.id === Number(stepId));

  // Fetch statuses for the step using the updated approach
  const {
    statuses = [],
    isLoading: isStatusesLoading,
    isError: isStatusesError,
    refetch: refetchStatuses
  } = useStepStatuses(Number(stepId));

  const handleAddStatus = () => {
    setSelectedStatus(null);
    setFormDialogOpen(true);
  };

  const handleEditStatus = (status: DocumentStatus) => {
    setSelectedStatus(status);
    setFormDialogOpen(true);
  };

  const handleDeleteStatus = (status: DocumentStatus) => {
    setSelectedStatus(status);
    setDeleteDialogOpen(true);
  };

  const isLoading = isCircuitLoading || isStepsLoading || isStatusesLoading;
  const isError = isCircuitError || isStepsError || isStatusesError;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-blue-900/30 rounded w-1/3"></div>
          <div className="h-4 bg-blue-900/30 rounded w-1/4"></div>
          <div className="h-64 bg-blue-900/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive" className="mb-4 border-red-800 bg-red-950/50 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {apiError || 'Failed to load step statuses. Please try again later.'}
          </AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link to={`/circuits/${circuitId}/steps`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Steps
          </Link>
        </Button>
      </div>
    );
  }

  // If circuit or step not found
  if (!circuit || !currentStep) {
    return (
      <div className="p-4 md:p-6">
        <Alert variant="destructive" className="mb-4 border-amber-800 bg-amber-950/50 text-amber-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>
            The circuit or step you're looking for doesn't exist or has been removed.
          </AlertDescription>
        </Alert>
        <Button variant="outline" asChild>
          <Link to="/circuits">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Circuits
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="p-3 sm:p-4 md:p-6 space-y-4 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to={`/circuits/${circuitId}/steps`}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
            <h1 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text truncate">
              {currentStep.title} - Statuses
            </h1>
          </div>
          <p className="text-gray-400 mt-1 text-sm">
            Circuit: <span className="text-blue-300">{circuit.title}</span> | 
            Step: <span className="font-mono text-blue-300">{currentStep.circuitDetailKey}</span>
          </p>
        </div>
        
        {!isSimpleUser && (
          <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" onClick={handleAddStatus}>
            <Plus className="mr-2 h-4 w-4" /> Add Status
          </Button>
        )}
      </div>
      
      {apiError && (
        <Alert variant="destructive" className="mb-4 border-red-800 bg-red-950/50 text-red-300">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {apiError}
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="w-full shadow-md bg-[#111633]/70 border-blue-900/30">
        <CardHeader className="flex flex-row items-center justify-between border-b border-blue-900/30 bg-blue-900/20 p-3 sm:p-4">
          <CardTitle className="text-lg text-blue-100">Step Statuses</CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <StatusTable 
            statuses={statuses}
            onEdit={handleEditStatus}
            onDelete={handleDeleteStatus}
            isSimpleUser={isSimpleUser}
          />
        </CardContent>
      </Card>
      
      {/* Status Form Dialog */}
      {!isSimpleUser && (
        <>
          <StatusFormDialog
            open={formDialogOpen}
            onOpenChange={setFormDialogOpen}
            onSuccess={refetchStatuses}
            status={selectedStatus}
            stepId={Number(stepId)}
          />
          
          {/* Delete Status Dialog */}
          <DeleteStatusDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            status={selectedStatus}
            onSuccess={refetchStatuses}
          />
        </>
      )}
    </div>
  );
}
