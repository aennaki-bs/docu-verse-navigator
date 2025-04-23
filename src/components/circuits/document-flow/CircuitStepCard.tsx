
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DocumentCircuitHistory } from '@/models/documentCircuit';
import { CircuitStepHistory } from './CircuitStepHistory';
import { CircuitStepFooter } from './CircuitStepFooter';

interface CircuitStepCardProps {
  detail: any;
  currentStepId: number | undefined | null;
  historyForStep: DocumentCircuitHistory[];
  isSimpleUser: boolean;
  onMoveClick: () => void;
  onProcessClick: () => void;
  isDraggedOver?: boolean;
  children?: React.ReactNode;
}

export const CircuitStepCard = ({ 
  detail, 
  currentStepId, 
  historyForStep, 
  isSimpleUser,
  onMoveClick,
  onProcessClick,
  isDraggedOver = false,
  children
}: CircuitStepCardProps) => {
  const isCurrentStep = detail.id === currentStepId;
  
  return (
    <Card 
      className={`h-full rounded-lg ${
        isDraggedOver 
          ? 'bg-green-900/10 border-green-500 shadow-lg shadow-green-500/20 transition-all duration-300' 
          : isCurrentStep 
            ? 'bg-[#0a1033] border-green-500/60 shadow-md shadow-green-500/20' 
            : 'bg-[#0a1033] border-blue-900/30'
      }`}
    >
      <CardHeader className={`pb-2 px-3 py-2 ${
        isCurrentStep ? 'border-b border-green-500/30 bg-[#060927]' : 'border-b border-blue-900/30'
      }`}>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center">
            <Badge 
              variant={isCurrentStep ? "success" : "outline"} 
              className={`mr-1.5 text-xs ${isCurrentStep ? 'bg-green-500/20' : 'bg-blue-500/20'}`}
            >
              {detail.orderIndex / 10}
            </Badge>
            <span className="truncate">{detail.title}</span>
          </CardTitle>
          {isCurrentStep && (
            <Badge variant="success" className="ml-1 text-xs px-1.5 py-0.5">Current</Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-2 text-xs">
        {detail.descriptif && (
          <p className="text-xs text-gray-400 mb-2 line-clamp-2">
            {detail.descriptif}
          </p>
        )}

        {/* Document card if this is the current step */}
        {children}

        {/* History items for this step */}
        {historyForStep.length > 0 && (
          <CircuitStepHistory historyForStep={historyForStep} />
        )}
      </CardContent>
      
      <CircuitStepFooter 
        responsibleRoleId={detail.responsibleRoleId}
        isCurrentStep={isCurrentStep}
        isSimpleUser={isSimpleUser}
        onProcessClick={onProcessClick}
        onMoveClick={onMoveClick}
      />
    </Card>
  );
};
