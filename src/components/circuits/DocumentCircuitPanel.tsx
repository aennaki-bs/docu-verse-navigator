
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ArrowRightCircle, GitBranch, HistoryIcon, Share2 } from 'lucide-react';
import circuitService from '@/services/circuitService';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import CircuitHistoryTimeline from './CircuitHistoryTimeline';
import AssignCircuitDialog from './AssignCircuitDialog';
import ProcessCircuitStepDialog from './ProcessCircuitStepDialog';
import MoveDocumentStepDialog from './MoveDocumentStepDialog';

interface CircuitPanelProps {
  document: any; // Use your document type here
  onUpdate?: () => void;
}

export default function DocumentCircuitPanel({ document, onUpdate }: CircuitPanelProps) {
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [moveStepDialogOpen, setMoveStepDialogOpen] = useState(false);
  
  const { data: history, isLoading } = useQuery({
    queryKey: ['document-circuit-history', document.id],
    queryFn: () => circuitService.getDocumentCircuitHistory(document.id),
    enabled: !!document.circuitId,
  });

  const handleAssignSuccess = () => {
    if (onUpdate) onUpdate();
    toast.success('Document assigned to circuit successfully');
  };

  const handleProcessSuccess = () => {
    if (onUpdate) onUpdate();
    toast.success('Document step processed successfully');
  };

  const handleMoveSuccess = () => {
    if (onUpdate) onUpdate();
    toast.success('Document moved to new step successfully');
  };

  // Calculate progress if document has a circuit
  const getProgress = () => {
    if (!document.circuit || !document.circuit.circuitDetails || document.circuit.circuitDetails.length === 0) {
      return 0;
    }

    if (document.isCircuitCompleted) {
      return 100;
    }

    // If we have history, we can calculate more accurately
    if (history && history.length > 0) {
      return Math.round((history.length / document.circuit.circuitDetails.length) * 100);
    }

    // Fallback
    return document.currentCircuitDetailId ? 
      Math.round((1 / document.circuit.circuitDetails.length) * 100) : 0;
  };

  const canProcess = document.currentCircuitDetailId && !document.isCircuitCompleted;
  const canMove = document.circuitId && !document.isCircuitCompleted;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center">
            <GitBranch className="mr-2 h-5 w-5" /> Circuit Management
          </CardTitle>
          <div className="space-x-2">
            {!document.circuitId && (
              <Button size="sm" onClick={() => setAssignDialogOpen(true)}>
                <Share2 className="mr-2 h-4 w-4" /> Assign to Circuit
              </Button>
            )}
            {canMove && (
              <Button size="sm" variant="outline" onClick={() => setMoveStepDialogOpen(true)}>
                <ArrowRightCircle className="mr-2 h-4 w-4" /> Move to Step
              </Button>
            )}
            {canProcess && (
              <Button size="sm" onClick={() => setProcessDialogOpen(true)}>
                Process Current Step
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {document.circuitId ? (
          <>
            <div className="mb-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Current Circuit</div>
                  <div className="font-semibold flex items-center">
                    {document.circuit?.circuitKey} - {document.circuit?.title}
                    {document.isCircuitCompleted && (
                      <Badge className="ml-2 bg-green-500">Completed</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">Current Step</div>
                  <div>
                    {document.currentCircuitDetail ? (
                      <Badge variant="outline" className="font-semibold">
                        {document.currentCircuitDetail.title}
                      </Badge>
                    ) : document.isCircuitCompleted ? (
                      <Badge className="bg-green-500">All steps completed</Badge>
                    ) : (
                      <Badge variant="outline">Unassigned</Badge>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Progress</span>
                  <span>{getProgress()}%</span>
                </div>
                <Progress value={getProgress()} className="h-2" />
              </div>
            </div>
          
            <Tabs defaultValue="history">
              <TabsList className="grid w-full grid-cols-1">
                <TabsTrigger value="history" className="flex items-center">
                  <HistoryIcon className="mr-2 h-4 w-4" /> History
                </TabsTrigger>
              </TabsList>
              <TabsContent value="history" className="mt-4">
                <CircuitHistoryTimeline documentId={document.id} />
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No circuit assigned to this document yet. 
            <Button 
              variant="link" 
              className="text-primary" 
              onClick={() => setAssignDialogOpen(true)}
            >
              Assign a circuit
            </Button>
          </div>
        )}
      </CardContent>

      {/* Dialogs */}
      <AssignCircuitDialog
        documentId={document.id}
        documentTitle={document.title}
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        onSuccess={handleAssignSuccess}
      />

      {document.currentCircuitDetail && (
        <ProcessCircuitStepDialog
          documentId={document.id}
          documentTitle={document.title}
          currentStep={document.currentCircuitDetail?.title || 'Current step'}
          open={processDialogOpen}
          onOpenChange={setProcessDialogOpen}
          onSuccess={handleProcessSuccess}
        />
      )}

      {document.circuitId && (
        <MoveDocumentStepDialog
          documentId={document.id}
          documentTitle={document.title}
          circuitId={document.circuitId}
          currentStepId={document.currentCircuitDetailId}
          open={moveStepDialogOpen}
          onOpenChange={setMoveStepDialogOpen}
          onSuccess={handleMoveSuccess}
        />
      )}
    </Card>
  );
}
