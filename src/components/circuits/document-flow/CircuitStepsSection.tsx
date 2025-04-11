
import { useState } from 'react';
import { GitBranch, MoveRight, AlertCircle, Check, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CircuitStepCard } from './CircuitStepCard';
import { DocumentCircuitHistory } from '@/models/documentCircuit';

interface CircuitStepsSectionProps {
  circuitDetails: any[];
  circuitHistory: DocumentCircuitHistory[];
  currentStepId: number | undefined | null;
  isSimpleUser: boolean;
  onMoveClick: () => void;
  onProcessClick: () => void;
}

export const CircuitStepsSection = ({
  circuitDetails,
  circuitHistory,
  currentStepId,
  isSimpleUser,
  onMoveClick,
  onProcessClick
}: CircuitStepsSectionProps) => {
  const [showHelp, setShowHelp] = useState(false);
  
  if (!circuitDetails || circuitDetails.length === 0) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No steps defined for this circuit. The circuit may be improperly configured.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <GitBranch className="mr-2 h-5 w-5" /> Circuit Flow Steps
        </h2>
        
        <div className="flex items-center space-x-2">
          {showHelp && (
            <div className="text-sm text-gray-400 bg-blue-900/20 p-2 rounded border border-blue-900/30">
              {isSimpleUser ? 
                "You can view the document flow, but only admins can move documents between steps." : 
                "You can process the current step or move the document to a different step."
              }
            </div>
          )}
          
          <Button 
            variant="ghost" 
            size="sm"
            className="text-gray-400 hover:text-white"
            onClick={() => setShowHelp(!showHelp)}
          >
            <AlertCircle className="h-4 w-4" />
          </Button>
          
          {!isSimpleUser && (
            <>
              <Button 
                onClick={onProcessClick}
                variant="outline"
                className="border-green-900/30 text-white hover:bg-green-900/20"
              >
                <Check className="mr-2 h-4 w-4" /> Process Current Step
              </Button>
              
              <Button 
                onClick={onMoveClick}
                variant="outline"
                className="border-blue-900/30 text-white hover:bg-blue-900/20"
              >
                <MoveRight className="mr-2 h-4 w-4" /> Move Document
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4 min-w-full">
          {circuitDetails?.map((detail) => {
            const historyForStep = circuitHistory?.filter(h => h.circuitDetailId === detail.id) || [];
            
            return (
              <div 
                key={detail.id} 
                className="w-80 flex-shrink-0"
              >
                <CircuitStepCard 
                  detail={detail}
                  currentStepId={currentStepId}
                  historyForStep={historyForStep}
                  isSimpleUser={isSimpleUser}
                  onMoveClick={onMoveClick}
                  onProcessClick={onProcessClick}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
