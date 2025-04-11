
import { Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Step, DocumentHistory } from '@/models/circuit';

interface CircuitStepCardProps {
  step: Step;
  currentStepId: number | undefined | null;
  historyForStep: DocumentHistory[];
  isSimpleUser: boolean;
  onMoveClick: () => void;
  onProcessClick: () => void;
}

export function CircuitStepCard({
  step,
  currentStepId,
  historyForStep,
  isSimpleUser,
  onMoveClick,
  onProcessClick
}: CircuitStepCardProps) {
  const isCurrent = step.id === currentStepId;
  const hasHistory = historyForStep.length > 0;
  
  // Calculate status based on step history
  const getStepStatus = () => {
    if (!hasHistory) {
      return isCurrent ? 'current' : 'pending';
    }
    
    const latestHistory = historyForStep[historyForStep.length - 1];
    if (isCurrent) return 'current';
    if (latestHistory.isApproved) return 'approved';
    return 'rejected';
  };
  
  const status = getStepStatus();
  
  // Apply different styling based on status
  const getBorderStyle = () => {
    switch(status) {
      case 'current':
        return 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]';
      case 'approved':
        return 'border-green-500/30';
      case 'rejected':
        return 'border-red-500/30';
      default:
        return 'border-gray-800';
    }
  };
  
  const getHeaderStyle = () => {
    switch(status) {
      case 'current':
        return 'bg-blue-900/40 border-b border-blue-500/30';
      case 'approved':
        return 'bg-green-900/20 border-b border-green-500/30';
      case 'rejected':
        return 'bg-red-900/20 border-b border-red-500/30';
      default:
        return 'bg-gray-900/40 border-b border-gray-800';
    }
  };
  
  const getStatusBadge = () => {
    switch(status) {
      case 'current':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Current</Badge>;
      case 'approved':
        return <Badge className="bg-green-900/20 text-green-300 border-green-500/30">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-900/20 text-red-300 border-red-500/30">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="text-gray-400 border-gray-700">Pending</Badge>;
    }
  };
  
  return (
    <Card className={cn(
      "border-2 transition-all duration-200",
      getBorderStyle()
    )}>
      <CardHeader className={cn("p-4", getHeaderStyle())}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <CardTitle className="text-lg font-semibold">
              {step.title}
            </CardTitle>
            {step.responsibleRole && (
              <span className="text-xs mt-1 text-gray-400">
                Required: {step.responsibleRole.name}
              </span>
            )}
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="p-4 text-sm">
        <div className="text-gray-400 mb-4">
          {step.descriptif || "No description available for this step."}
        </div>
        
        {hasHistory && (
          <div className="mt-4 space-y-3">
            <h4 className="text-xs uppercase text-gray-500 font-semibold">History</h4>
            {historyForStep.map((item, index) => (
              <div key={item.id} className="pl-4 border-l-2 text-xs space-y-1 pb-2 relative">
                <div className={cn(
                  "w-3 h-3 rounded-full absolute -left-[7px] top-0",
                  item.isApproved ? "bg-green-400" : "bg-red-400"
                )} />
                <div className="flex items-center">
                  {item.isApproved ? (
                    <CheckCircle className="h-3 w-3 mr-1 text-green-400" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1 text-red-400" />
                  )}
                  <span className="font-medium">
                    {item.isApproved ? 'Approved' : 'Rejected'} by {item.processedBy?.firstName} {item.processedBy?.lastName}
                  </span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(item.processedAt).toLocaleString()}
                </div>
                {item.comments && (
                  <p className="text-gray-400 mt-1">{item.comments}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {isCurrent && !isSimpleUser && (
        <CardFooter className="p-3 pt-0 flex justify-between">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-blue-900/30 hover:bg-blue-900/20"
            onClick={onMoveClick}
          >
            <ArrowRight className="h-4 w-4 mr-2" /> Move
          </Button>
          <Button 
            size="sm" 
            className="w-full ml-2 bg-blue-600 hover:bg-blue-700"
            onClick={onProcessClick}
          >
            Process
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
