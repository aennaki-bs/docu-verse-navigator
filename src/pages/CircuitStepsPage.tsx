
import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { StepFormDialog } from '@/components/steps/dialogs/StepFormDialog';
import { DeleteStepDialog } from '@/components/steps/dialogs/DeleteStepDialog';
import { BulkActionBar } from '@/components/steps/BulkActionBar';
import { StepLoadingState } from '@/components/steps/StepLoadingState';
import { useAuth } from '@/context/AuthContext';
import { useCircuitSteps } from '@/hooks/useCircuitSteps';
import { CircuitStepsHeader } from '@/components/circuit-steps/CircuitStepsHeader';
import { CircuitStepsSearchBar } from '@/components/circuit-steps/CircuitStepsSearchBar';
import { CircuitStepsContent } from '@/components/circuit-steps/CircuitStepsContent';
import { CircuitStepsError } from '@/components/circuit-steps/CircuitStepsError';

export default function CircuitStepsPage() {
  const { circuitId = '' } = useParams<{ circuitId: string }>();
  const { user } = useAuth();
  const isSimpleUser = user?.role === 'SimpleUser';
  
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);

  const {
    circuit,
    steps,
    searchQuery,
    selectedSteps,
    apiError,
    viewMode,
    isLoading,
    isError,
    setSearchQuery,
    handleStepSelection,
    handleSelectAll,
    setViewMode,
    setSelectedSteps,
    refetchSteps
  } = useCircuitSteps(circuitId);

  const handleAddStep = () => {
    setSelectedStep(null);
    setFormDialogOpen(true);
  };

  const handleEditStep = (step: Step) => {
    setSelectedStep(step);
    setFormDialogOpen(true);
  };

  const handleDeleteStep = (step: Step) => {
    setSelectedStep(step);
    setDeleteDialogOpen(true);
  };

  const handleBulkDelete = () => {
    // Implement bulk delete functionality here
    // You would call a service method to delete multiple steps
    setSelectedSteps([]);
  };

  if (isLoading) {
    return <StepLoadingState />;
  }

  if (isError) {
    return (
      <CircuitStepsError errorMessage={apiError} type="error" />
    );
  }

  // If circuit not found
  if (!circuit) {
    return (
      <CircuitStepsError type="notFound" />
    );
  }

  return (
    <div className="container-fluid responsive-padding space-y-6">
      <CircuitStepsHeader 
        circuit={circuit} 
        onAddStep={handleAddStep} 
        isSimpleUser={isSimpleUser} 
      />
      
      {apiError && (
        <CircuitStepsError errorMessage={apiError} type="error" />
      )}
      
      <CircuitStepsSearchBar 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <CircuitStepsContent
        steps={steps}
        selectedSteps={selectedSteps}
        onSelectStep={handleStepSelection}
        onSelectAll={handleSelectAll}
        onEdit={handleEditStep}
        onDelete={handleDeleteStep}
        onDetails={(step) => window.location.href = `/circuits/${circuitId}/steps/${step.id}/statuses`}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onAddStep={handleAddStep}
        isSimpleUser={isSimpleUser}
        circuitId={circuitId}
      />
      
      <BulkActionBar
        selectedCount={selectedSteps.length}
        onBulkDelete={handleBulkDelete}
      />
      
      {/* Step Form Dialog - Now passing the circuit ID */}
      <StepFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSuccess={refetchSteps}
        editStep={selectedStep ?? undefined}
        circuitId={parseInt(circuitId, 10)}
      />
      
      {/* Delete Step Dialog */}
      <DeleteStepDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        step={selectedStep}
        onSuccess={refetchSteps}
      />
    </div>
  );
}
