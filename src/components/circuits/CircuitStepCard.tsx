
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DocumentHistory, Step } from '@/models/circuit';

export interface CircuitStepCardProps {
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
              History
            </div>
            <div className="space-y-2 text-xs">
              {historyForStep.slice(0, 3).map((history, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-400">
                    {new Date(history.actionDate).toLocaleDateString()}
                  </span>
                  <span className="text-gray-300">
                    {history.actionBy.firstName} {history.actionBy.lastName}
                  </span>
                </div>
              ))}
              {historyForStep.length > 3 && (
                <div className="text-center text-gray-500 text-xs mt-1">
                  +{historyForStep.length - 3} more entries
                </div>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        {isCurrentStep && !isSimpleUser && (
          <div className="border-t border-gray-800 pt-2 flex justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-green-400 hover:text-green-300 hover:bg-green-900/20"
              onClick={onProcessClick}
            >
              <CheckCircle className="mr-1 h-3 w-3" /> Process
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
              onClick={onMoveClick}
            >
              Move &rarr;
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
