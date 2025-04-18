
import { useState } from 'react';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';

export function useWorkflowNavigation(documentId: number, onNavigationSuccess: () => void) {
  const [isNavigating, setIsNavigating] = useState(false);

  const returnToPreviousStep = async (comments: string = '') => {
    if (!documentId) return;
    
    setIsNavigating(true);
    try {
      await circuitService.moveDocumentToStep({
        documentId,
        comments
      });
      toast.success('Document returned to previous step');
      onNavigationSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to return document to previous step';
      toast.error(errorMessage);
      console.error('Error returning to previous step:', error);
    } finally {
      setIsNavigating(false);
    }
  };

  return {
    isNavigating,
    returnToPreviousStep
  };
}
