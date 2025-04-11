
import { Check, X, MoveRight, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DocumentCircuitHistory } from '@/models/documentCircuit';

interface CircuitStepCardProps {
  detail: any;
  currentStepId: number | undefined | null;
  historyForStep: DocumentCircuitHistory[];
  isSimpleUser: boolean;
  onMoveClick: () => void;
  onProcessClick: () => void;
}

export const CircuitStepCard = ({ 
  detail, 
  currentStepId, 
  historyForStep, 
  isSimpleUser, 
  onMoveClick,
  onProcessClick
}: CircuitStepCardProps) => {
  const isCurrentStep = detail.id === currentStepId;
  
  return (
    <Card 
      className={`h-full ${
        isCurrentStep 
          ? 'bg-[#0a1033] border-green-500 shadow-md shadow-green-500/20' 
          : 'bg-[#0a1033] border-blue-900/30'
      }`}
    >
      <CardHeader className={`pb-3 ${
        isCurrentStep ? 'border-b border-green-500/30 bg-[#060927]' : 'border-b border-blue-900/30'
      }`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Badge 
              variant={isCurrentStep ? "success" : "outline"} 
              className="mr-2"
            >
              {detail.orderIndex + 1}
            </Badge>
            {detail.title}
          </CardTitle>
          {isCurrentStep && (
            <Badge variant="success" className="ml-2">Current</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-sm text-gray-400 mb-4">
          {detail.descriptif || 'No description provided for this step'}
        </p>

        {/* History items for this step */}
        <div className="space-y-3">
          {historyForStep.length > 0 ? (
            historyForStep.map(history => (
              <Card key={history.id} className="bg-[#070b28] border border-blue-900/30">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">
                      Processed by: {history.userName || history.processedBy || 'Unknown'}
                    </span>
                    <Badge variant={history.isApproved ? "success" : "destructive"}>
                      {history.isApproved ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(history.processedAt).toLocaleString()}
                  </p>
                  {history.comments && (
                    <div className="mt-2 p-2 bg-[#111633]/40 rounded text-xs border border-blue-900/30">
                      "{history.comments}"
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center text-gray-500 text-sm p-2">
              No history for this step yet
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 border-t border-blue-900/30 bg-[#060927] flex justify-between">
        {detail.responsibleRoleId ? (
          <Badge variant="outline" className="text-xs">
            Responsible: Role #{detail.responsibleRoleId}
          </Badge>
        ) : (
          <span className="text-xs text-gray-500">No responsible role</span>
        )}
        
        {isCurrentStep && !isSimpleUser && (
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs bg-green-900/10 border-green-900/30 hover:bg-green-900/20"
              onClick={onProcessClick}
            >
              <CheckCircle className="h-3 w-3 mr-1" /> Process
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              className="text-xs"
              onClick={onMoveClick}
            >
              <MoveRight className="h-3 w-3 mr-1" /> Move
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
