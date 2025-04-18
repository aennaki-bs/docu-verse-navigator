
import { Dispatch, SetStateAction } from 'react';
import MoveDocumentStepDialog from '@/components/circuits/MoveDocumentStepDialog';
import ProcessCircuitStepDialog from '@/components/circuits/ProcessCircuitStepDialog';
import MoveToNextStepDialog from '@/components/circuits/MoveToNextStepDialog';
import { Document } from '@/models/document';
import { ActionDto, DocumentWorkflowStatus } from '@/models/documentCircuit';

interface DocumentDialogsProps {
  document: Document | null;
  workflowStatus: DocumentWorkflowStatus | null | undefined;
  moveDialogOpen: boolean;
  processDialogOpen: boolean;
  nextStepDialogOpen: boolean;
  setMoveDialogOpen: (open: boolean) => void;
  setProcessDialogOpen: (open: boolean) => void;
  setNextStepDialogOpen: (open: boolean) => void;
  handleMoveSuccess: () => void;
  handleProcessSuccess: () => void;
  handleNextStepSuccess: () => void;
  currentStepDetail?: { title: string } | null;
  availableActions?: ActionDto[];
}

export function DocumentDialogs({
  document,
  workflowStatus,
  moveDialogOpen,
  processDialogOpen,
  nextStepDialogOpen,
  setMoveDialogOpen,
  setProcessDialogOpen,
  setNextStepDialogOpen,
  handleMoveSuccess,
  handleProcessSuccess,
  handleNextStepSuccess,
  currentStepDetail,
  availableActions = []
}: DocumentDialogsProps) {
  if (!document || !workflowStatus) return null;

  return (
    <>
      <MoveDocumentStepDialog
        documentId={document.id}
        documentTitle={document.title}
        circuitId={document.circuitId!}
        currentStepId={workflowStatus.currentStepId}
        open={moveDialogOpen}
        onOpenChange={setMoveDialogOpen}
        onSuccess={handleMoveSuccess}
      />
      
      {currentStepDetail && (
        <ProcessCircuitStepDialog
          documentId={document.id}
          documentTitle={document.title}
          currentStep={currentStepDetail.title}
          availableActions={availableActions}
          open={processDialogOpen}
          onOpenChange={setProcessDialogOpen}
          onSuccess={handleProcessSuccess}
        />
      )}
      
      {document.circuitId && workflowStatus.currentStepId && (
        <MoveToNextStepDialog
          documentId={document.id}
          documentTitle={document.title}
          circuitId={document.circuitId}
          currentStepId={workflowStatus.currentStepId}
          open={nextStepDialogOpen}
          onOpenChange={setNextStepDialogOpen}
          onSuccess={handleNextStepSuccess}
        />
      )}
    </>
  );
}
