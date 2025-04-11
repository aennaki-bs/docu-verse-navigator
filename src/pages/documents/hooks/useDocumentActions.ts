
import { useCallback } from 'react';
import { NavigateFunction } from 'react-router-dom';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import { Document } from '@/models/document';

export function useDocumentActions(
  navigate: NavigateFunction,
  refetch: () => void
) {
  const handleCreateDocument = useCallback(() => {
    navigate('/documents/create');
  }, [navigate]);

  const handleEditDocument = useCallback((id: number) => {
    navigate(`/documents/${id}/edit`);
  }, [navigate]);

  const handleDeleteDocument = useCallback(async (document: Document) => {
    try {
      await documentService.deleteDocument(document.id);
      toast.success(`Document "${document.title}" deleted successfully`);
      refetch();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  }, [refetch]);

  const handleViewDocumentFlow = useCallback((id: number) => {
    navigate(`/documents/${id}/flow`);
  }, [navigate]);

  return {
    handleCreateDocument,
    handleEditDocument,
    handleDeleteDocument,
    handleViewDocumentFlow
  };
}
