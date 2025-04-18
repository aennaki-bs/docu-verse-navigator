import { useWorkflowStatus } from './document-workflow/useWorkflowStatus';
import { useWorkflowActions } from './document-workflow/useWorkflowActions';
import { useWorkflowNavigation } from './document-workflow/useWorkflowNavigation';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

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

  // Setup periodic background refetch to keep the UI updated
  useEffect(() => {
    // Only set up refetch interval if we have a valid document ID
    if (documentId) {
      const intervalId = setInterval(() => {
        // Silent background refetch
        queryClient.invalidateQueries({ 
          queryKey: ['document-workflow-status', documentId],
          type: 'inactive' // Only refresh if the query is inactive (not already fetching)
        });
      }, 60000); // Every 60 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [documentId, queryClient]);

  const refreshAllData = () => {
    // Set up a set of queries to invalidate for a full refresh
    const queriesToInvalidate = [
      ['document-workflow-status', documentId],
      ['document', documentId],
      ['document-circuit-history', documentId],
      ['circuit-details', workflowStatus?.circuitId]
    ];
    
    // Invalidate each query
    queriesToInvalidate.forEach(queryKey => {
      if (queryKey[1]) { // Only invalidate if the second part of the key exists
        queryClient.invalidateQueries({ queryKey });
      }
    });
  };

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
    refetch,
    refreshAllData
  };
}
