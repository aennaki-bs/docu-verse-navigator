
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import circuitService from '@/services/circuitService';
import { Document } from '@/models/document';
import MoveDocumentStepDialog from '@/components/circuits/MoveDocumentStepDialog';
import ProcessCircuitStepDialog from '@/components/circuits/ProcessCircuitStepDialog';
import { DocumentFlowHeader } from '@/components/circuits/document-flow/DocumentFlowHeader';
import { DocumentCard } from '@/components/circuits/document-flow/DocumentCard';
import { CircuitStepsSection } from '@/components/circuits/document-flow/CircuitStepsSection';
import { NoCircuitAssignedCard } from '@/components/circuits/document-flow/NoCircuitAssignedCard';
import { LoadingState } from '@/components/circuits/document-flow/LoadingState';
import { Button } from '@/components/ui/button';

const DocumentFlowPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [document, setDocument] = useState<Document | null>(null);
  const [moveDialogOpen, setMoveDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch document data
  const { data: documentData, isLoading: isLoadingDocument, refetch: refetchDocument, error: documentError } = useQuery({
    queryKey: ['document', id],
    queryFn: () => documentService.getDocumentById(Number(id)),
  });

  // Fetch circuit details
  const { data: circuitDetails, isLoading: isLoadingCircuitDetails, error: circuitDetailsError } = useQuery({
    queryKey: ['circuit-details', documentData?.circuitId],
    queryFn: () => circuitService.getCircuitDetailsByCircuitId(documentData?.circuitId || 0),
    enabled: !!documentData?.circuitId,
  });

  // Fetch document circuit history
  const { data: circuitHistory, isLoading: isLoadingHistory, refetch: refetchHistory, error: historyError } = useQuery({
    queryKey: ['document-circuit-history', id],
    queryFn: () => circuitService.getDocumentCircuitHistory(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (documentData) {
      console.log('Document data:', documentData);
      setDocument(documentData);
    }
    
    // Collect any errors
    const allErrors = [documentError, circuitDetailsError, historyError].filter(Boolean);
    if (allErrors.length > 0) {
      console.error('Errors loading document flow data:', allErrors);
      setError('Error loading document flow data. Please try again.');
    } else {
      setError(null);
    }
  }, [documentData, documentError, circuitDetailsError, historyError]);

  if (!id) {
    navigate('/documents');
    return null;
  }

  const handleMoveSuccess = () => {
    refetchDocument();
    refetchHistory();
    toast.success("Document moved successfully");
  };

  const handleProcessSuccess = () => {
    refetchDocument();
    refetchHistory();
    toast.success("Document step processed successfully");
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

  // Find current step details for processing
  const currentStepDetail = circuitDetails?.find(d => d.id === currentStepId);

  return (
    <div className="p-6 space-y-6">
      <DocumentFlowHeader 
        documentId={id} 
        document={document}
        navigateBack={() => navigate(`/documents/${id}`)}
      />
      
      {/* Error message */}
      {error && (
        <div className="p-4 rounded bg-red-900/20 border border-red-900/30 text-red-400 mb-4">
          {error}
          <Button 
            variant="link" 
            className="text-red-400 underline ml-2 p-0 h-auto" 
            onClick={() => window.location.reload()}
          >
            Reload page
          </Button>
        </div>
      )}
      
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
                onProcessClick={() => setProcessDialogOpen(true)}
              />
            )}
          </div>
        </div>
      )}
      
      {document && (
        <>
          <MoveDocumentStepDialog
            documentId={Number(id)}
            documentTitle={document.title}
            circuitId={document.circuitId!}
            currentStepId={document.currentCircuitDetailId}
            open={moveDialogOpen}
            onOpenChange={setMoveDialogOpen}
            onSuccess={handleMoveSuccess}
          />
          
          {currentStepDetail && (
            <ProcessCircuitStepDialog
              documentId={Number(id)}
              documentTitle={document.title}
              currentStep={currentStepDetail.title}
              open={processDialogOpen}
              onOpenChange={setProcessDialogOpen}
              onSuccess={handleProcessSuccess}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DocumentFlowPage;
