
import { GitBranch, MoveRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CircuitStepCard } from './CircuitStepCard';
import { DocumentCircuitHistory } from '@/models/documentCircuit';

interface CircuitStepsSectionProps {
  circuitDetails: any[];
  circuitHistory: DocumentCircuitHistory[];
  currentStepId: number | undefined | null;
  isSimpleUser: boolean;
  onMoveClick: () => void;
}

export const CircuitStepsSection = ({
  circuitDetails,
  circuitHistory,
  currentStepId,
  isSimpleUser,
  onMoveClick
}: CircuitStepsSectionProps) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <GitBranch className="mr-2 h-5 w-5" /> Circuit Flow Steps
        </h2>
        
        {!isSimpleUser && (
          <Button 
            onClick={onMoveClick}
            variant="outline"
            className="border-blue-900/30 text-white hover:bg-blue-900/20"
          >
            <MoveRight className="mr-2 h-4 w-4" /> Move Document
          </Button>
        )}
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
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
