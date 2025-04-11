
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DocumentHistory, Step } from '@/models/circuit';

interface CircuitStepCardProps {
  step: Step;
  currentStepId: number | undefined | null;
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
  onProcessClick,
}: CircuitStepCardProps) => {
  const isCurrentStep = step.id === currentStepId;
  const hasHistory = historyForStep.length > 0;
  const mostRecentHistory = hasHistory ? historyForStep[0] : null;
  
  const getStatusColor = () => {
    if (isCurrentStep) return "bg-blue-500/20 border-blue-500/30 text-blue-400";
    if (hasHistory) return "bg-green-500/20 border-green-500/30 text-green-400";
    return "bg-gray-700/20 border-gray-700/30 text-gray-400";
  };

  return (
    <Card className={`border ${isCurrentStep ? 'border-blue-500/50' : 'border-gray-800'} shadow-md ${isCurrentStep ? 'bg-blue-900/10' : ''}`}>
      <CardHeader className={`pb-2 ${isCurrentStep ? 'bg-blue-900/20 rounded-t-lg' : ''}`}>
        <CardTitle className="text-sm flex justify-between items-center">
          <span>
            Step {step.orderIndex + 1}: {step.title}
          </span>
          {isCurrentStep && (
            <Badge 
              className="bg-blue-500/30 text-blue-300 border-blue-500/30"
            >
              Current
            </Badge>
          )}
          {hasHistory && !isCurrentStep && (
            <Badge 
              className="bg-green-500/30 text-green-300 border-green-500/30"
            >
              Completed
            </Badge>
          )}
          {step.isFinalStep && (
            <Badge
              variant="outline" 
              className="bg-purple-500/10 text-purple-300 border-purple-500/30"
            >
              Final
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {step.descriptif && (
          <p className="text-xs text-gray-400">{step.descriptif}</p>
        )}
        
        {/* Step status */}
        <div className="border-t border-gray-800 pt-2">
          <div className="text-xs font-semibold mb-1 text-gray-400">
            Status
          </div>
          <Badge className={`text-xs ${getStatusColor()}`}>
            {isCurrentStep ? 'In Progress' : hasHistory ? 'Completed' : 'Pending'}
          </Badge>
        </div>

        {/* Step history */}
        {historyForStep.length > 0 && (
          <div className="border-t border-gray-800 pt-2">
            <div className="text-xs font-semibold mb-1 text-gray-400">
              History ({historyForStep.length})
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {historyForStep.map((history) => (
                <div 
                  key={history.id} 
                  className="text-xs bg-gray-800/30 p-1.5 rounded"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-gray-300">
                      {history.action?.title || 'Action'}
                    </span>
                    {history.isApproved ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <AlertCircle className="h-3 w-3 text-red-500" />
                    )}
                  </div>
                  <div className="flex items-center text-gray-400">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>
                      {new Date(history.processedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {isCurrentStep && !isSimpleUser && (
          <div className="flex gap-2 pt-2 border-t border-gray-800">
            <Button 
              size="sm" 
              className="w-full text-xs h-7"
              onClick={onProcessClick}
            >
              Process
            </Button>
            <Button 
              size="sm"
              variant="outline"
              className="w-full text-xs h-7"
              onClick={onMoveClick}
            >
              Move
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
