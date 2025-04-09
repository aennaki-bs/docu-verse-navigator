
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import circuitService from '@/services/circuitService';
import { Document } from '@/models/document';
import MoveDocumentStepDialog from '@/components/circuits/MoveDocumentStepDialog';
import { DocumentFlowHeader } from '@/components/circuits/document-flow/DocumentFlowHeader';
import { DocumentCard } from '@/components/circuits/document-flow/DocumentCard';
import { CircuitStepsSection } from '@/components/circuits/document-flow/CircuitStepsSection';
import { NoCircuitAssignedCard } from '@/components/circuits/document-flow/NoCircuitAssignedCard';
import { LoadingState } from '@/components/circuits/document-flow/LoadingState';

const DocumentFlowPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);

  // Fetch document data
  const { data: documentData, isLoading: isLoadingDocument, refetch: refetchDocument } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentService.getDocumentById(Number(id)),
  });

  // Fetch circuit details
  const { data: circuitDetails, isLoading: isLoadingCircuitDetails } = useQuery({
    queryKey: ['circuit-details', documentData?.circuitId],
    queryFn: () => circuitService.getCircuitDetailsByCircuitId(documentData?.circuitId || 0),
    enabled: !!documentData?.circuitId,
  });

  // Fetch document circuit history
  const { data: circuitHistory, isLoading: isLoadingHistory, refetch: refetchHistory } = useQuery({
    queryKey: ['document-circuit-history', id],
    queryFn: () => circuitService.getDocumentCircuitHistory(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (documentData) {
      console.log('Document data:', documentData);
      setDocument(documentData);
    }
  }, [documentData]);

  if (!id) {
    navigate('/documents');
    return null;
  }

  const handleMoveSuccess = () => {
    refetchDocument();
    refetchHistory();
    toast.success("Document moved successfully");
  };

  console.log('Circuit ID from document:', documentData?.circuitId);
  
  // Check if the document has been loaded and doesn't have a circuit assigned
  const isNoCircuit = !isLoadingDocument && documentData && documentData.circuitId === null;

  // If document is not in a circuit
  if (isNoCircuit) {
    return (
      <div className="p-6 space-y-6">
        <DocumentFlowHeader 
          documentId={id} 
          document={documentData}
          navigateBack={() => navigate(`/documents/${id}`)}
        />
        
        <NoCircuitAssignedCard 
          documentId={id}
          navigateToDocument={() => navigate(`/documents/${id}`)}
        />
      </div>
    );
  }

  const isLoading = isLoadingDocument || isLoadingCircuitDetails || isLoadingHistory;
  const currentStepId = document?.currentCircuitDetailId;
  const isSimpleUser = user?.role === 'SimpleUser';

  return (
    <div className="p-6 space-y-6">
      <DocumentFlowHeader 
        documentId={id} 
        document={document}
        navigateBack={() => navigate(`/documents/${id}`)}
      />
      
      {/* Loading state */}
      {isLoading ? (
        <LoadingState />
      ) : (
        <div className="flex flex-col gap-6">
          {/* Trello-like board layout */}
          <div className="grid grid-cols-1 gap-6">
            {/* Document Card */}
            {document && <DocumentCard document={document} />}

            {/* Circuit Steps */}
            {circuitDetails && circuitDetails.length > 0 && (
              <CircuitStepsSection
                circuitDetails={circuitDetails}
                circuitHistory={circuitHistory || []}
                currentStepId={currentStepId}
                isSimpleUser={isSimpleUser}
                onMoveClick={() => setMoveDialogOpen(true)}
              />
            )}
          </div>
        </div>
      )}
      
      {document && (
        <MoveDocumentStepDialog
          documentId={Number(id)}
          documentTitle={document.title}
          circuitId={document.circuitId!}
          currentStepId={document.currentCircuitDetailId}
          open={moveDialogOpen}
          onOpenChange={setMoveDialogOpen}
          onSuccess={handleMoveSuccess}
        />
      )}
    </div>
  );
};

export default DocumentFlowPage;
