
import { Check, Clock, FileText, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Step, DocumentHistory } from '@/models/circuit'; 

interface CircuitStepCardProps {
  step: Step;
  currentStepId?: number | null;
  historyForStep: DocumentHistory[];
  isSimpleUser: boolean;
  onMoveClick: () => void;
  onProcessClick: () => void;
}

export const CircuitStepCard = ({
  step,
  currentStepId,
  historyForStep,
  isSimpleUser,
  onMoveClick,
  onProcessClick
}: CircuitStepCardProps) => {
  const isCurrent = step.id === currentStepId;
  const isCompleted = historyForStep.length > 0;
  const lastAction = historyForStep.length > 0 ? 
    historyForStep.sort((a, b) => 
      new Date(b.processedAt).getTime() - new Date(a.processedAt).getTime()
    )[0] : null;
  
  const cardClasses = isCurrent 
    ? "border-blue-500 bg-blue-900/30" 
    : isCompleted 
      ? "border-green-900/30 bg-green-900/10" 
      : "border-blue-900/20 bg-[#111633]/50";
  
  const getStatusBadge = () => {
    if (isCurrent) {
      return (
        <Badge className="bg-blue-500/30 hover:bg-blue-500/40 text-blue-100 border-blue-400/30">
          Current
        </Badge>
      );
    }
    
    if (lastAction?.isApproved) {
      return (
        <Badge variant="outline" className="bg-green-900/20 text-green-300 border-green-600/30">
          <Check className="h-3 w-3 mr-1" /> Approved
        </Badge>
      );
    }
    
    if (lastAction && !lastAction.isApproved) {
      return (
        <Badge variant="outline" className="bg-red-900/20 text-red-300 border-red-600/30">
          <XCircle className="h-3 w-3 mr-1" /> Rejected
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-gray-900/20 text-gray-400 border-gray-700/30">
        Pending
      </Badge>
    );
  };

  return (
    <Card className={`h-full flex flex-col ${cardClasses}`}>
      <CardHeader className={`flex-row justify-between items-start p-3 border-b ${
        isCurrent ? 'border-blue-500/30' : 'border-blue-900/20'
      }`}>
        <div className="flex items-center space-x-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-900/40 text-blue-200 text-xs">
            {step.orderIndex + 1}
          </span>
          <div className="text-sm font-medium truncate max-w-[150px]" title={step.title}>
            {step.title}
          </div>
        </div>
        
        {getStatusBadge()}
      </CardHeader>
      
      <CardContent className="p-3 text-sm flex-1 flex flex-col">
        <div className="mb-4 text-blue-200/80">
          {step.descriptif || <span className="text-blue-200/40 italic">No description</span>}
        </div>
        
        <div className="mt-auto">
          {lastAction ? (
            <div className="text-xs space-y-1 border-t border-blue-900/20 pt-2">
              <div className="flex items-center text-blue-200/60">
                <Clock className="h-3 w-3 mr-1" /> 
                {format(new Date(lastAction.processedAt), 'PPp')}
              </div>
              
              <div className="flex items-center text-blue-200/60">
                <FileText className="h-3 w-3 mr-1" /> 
                {lastAction.comments ? 
                  <span className="truncate max-w-[200px]" title={lastAction.comments}>
                    {lastAction.comments}
                  </span> : 
                  <span className="italic text-blue-200/40">No comments</span>
                }
              </div>
            </div>
          ) : (
            <div className="text-xs text-blue-200/40 border-t border-blue-900/20 pt-2 italic">
              No history for this step
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
