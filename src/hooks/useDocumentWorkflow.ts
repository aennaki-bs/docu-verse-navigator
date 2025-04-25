import { useWorkflowStatus } from './document-workflow/useWorkflowStatus';
import { useWorkflowActions } from './document-workflow/useWorkflowActions';
import { useWorkflowNavigation } from './document-workflow/useWorkflowNavigation';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';
import circuitService from '@/services/circuitService';
import { toast } from 'sonner';

export function useDocumentWorkflow(documentId: number) {
  const queryClient = useQueryClient();
  
  // Get document workflow status
  const { 
    workflowStatus, 
    isLoading, 
    isError, 
    error,
    refetch 
  } = useWorkflowStatus(documentId);

  // Get workflow action handlers
  const { isActionLoading, performAction } = useWorkflowActions(documentId, refetch);

  // Get workflow navigation handlers
  const { isNavigating, returnToPreviousStep } = useWorkflowNavigation(documentId, refetch);

  // Mutation for deleting a step
  const { mutate: deleteStep } = useMutation({
    mutationFn: async (stepId: number) => {
      await circuitService.deleteCircuitDetail(stepId);
    },
    onSuccess: () => {
      refreshAllData();
      toast.success('Step deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting step:', error);
      toast.error('Failed to delete step');
    }
  });

  // Mutation for moving to next step
  const { mutate: moveToNextStep } = useMutation({
    mutationFn: async (params: { 
      nextStepId: number, 
      comments?: string 
    }) => {
      if (!workflowStatus?.currentStepId) throw new Error('No current step');
      return circuitService.moveDocumentToNextStep({
        documentId,
        currentStepId: workflowStatus.currentStepId,
        nextStepId: params.nextStepId,
        comments: params.comments
      });
    },
    onSuccess: () => {
      refreshAllData();
      toast.success('Document moved to next step successfully');
    },
    onError: (error) => {
      console.error('Error moving to next step:', error);
      toast.error('Failed to move document to next step');
    }
  });

  // Mutation for moving to any step
  const { mutate: moveToStep } = useMutation({
    mutationFn: async (params: { 
      targetStepId: number,
      currentStep: any,
      targetStep: any,
      comments?: string 
    }) => {
      const { targetStepId, currentStep, targetStep, comments } = params;
      
      if (!workflowStatus?.currentStepId) {
        throw new Error('No current step');
      }

      // Determine if moving forward or backward based on step order
      const isMovingForward = targetStep.orderIndex > currentStep.orderIndex;
      
      if (isMovingForward) {
        return circuitService.moveDocumentToNextStep({
          documentId,
          currentStepId: workflowStatus.currentStepId,
          nextStepId: targetStepId,
          comments
        });
      } else {
        return circuitService.moveDocumentToStep({
          documentId,
          comments
        });
      }
    },
    onSuccess: () => {
      refreshAllData();
      toast.success('Document moved successfully');
    },
    onError: (error) => {
      console.error('Error moving document:', error);
      toast.error('Failed to move document');
    }
  });

  const refreshAllData = useCallback(() => {
    const queriesToInvalidate = [
      ['document-workflow', documentId],
      ['document', documentId],
      ['document-circuit-history', documentId],
      ['document-workflow-statuses', documentId],
      ['circuit-details', workflowStatus?.circuitId]
    ];
    
    queriesToInvalidate.forEach(queryKey => {
      if (queryKey[1]) {
        queryClient.invalidateQueries({ queryKey });
      }
    });
  }, [documentId, workflowStatus?.circuitId, queryClient]);

  return {
    // Status and data
    workflowStatus,
    isLoading,
    isError,
    error,
    
    // Actions
    isActionLoading: isActionLoading || isNavigating,
    performAction,
    returnToPreviousStep,
    moveToNextStep,
    moveToStep,
    deleteStep,
    refetch,
    refreshAllData
  };
}
