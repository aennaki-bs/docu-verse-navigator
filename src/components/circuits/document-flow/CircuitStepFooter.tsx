
import { Button } from '@/components/ui/button';
import { CheckCircle, MoveHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CircuitStepFooterProps {
  responsibleRoleId?: number | null;
  isCurrentStep: boolean;
  isSimpleUser: boolean;
  onProcessClick: () => void;
  onMoveClick: () => void;
}

export const CircuitStepFooter = ({
  responsibleRoleId,
  isCurrentStep,
  isSimpleUser,
  onProcessClick,
  onMoveClick
}: CircuitStepFooterProps) => {
  const getRoleName = (roleId: number | null | undefined) => {
    if (!roleId) return 'Any';
    
    switch (roleId) {
      case 1: return 'Admin';
      case 2: return 'User';
      case 3: return 'Power User';
      default: return `Role ${roleId}`;
    }
  };
  
  return (
    <div className={`px-2 py-1.5 flex items-center justify-between border-t ${
      isCurrentStep ? 'border-green-500/30' : 'border-blue-900/30'
    }`}>
      <Badge variant="outline" className="text-[10px] py-0 px-1.5">
        {getRoleName(responsibleRoleId)}
      </Badge>
      
      {isCurrentStep && !isSimpleUser && (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onProcessClick}
            className="h-6 text-xs px-2 hover:bg-blue-900/20"
          >
            <CheckCircle className="h-3 w-3 mr-1" /> Process
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveClick}
            className="h-6 text-xs px-2 hover:bg-blue-900/20"
          >
            <MoveHorizontal className="h-3 w-3 mr-1" /> Move
          </Button>
        </div>
      )}
    </div>
  );
};
