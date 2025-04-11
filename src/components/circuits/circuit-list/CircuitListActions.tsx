
import { Edit, Trash2, FileText, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CircuitListActionsProps {
  circuit: Circuit;
  isSimpleUser: boolean;
  onEdit: (circuit: Circuit) => void;
  onDelete: (circuit: Circuit) => void;
  onViewDetails: (circuit: Circuit) => void;
}

export function CircuitListActions({ 
  circuit,
  isSimpleUser,
  onEdit,
  onDelete,
  onViewDetails
}: CircuitListActionsProps) {
  const handleEdit = () => {
    if (isSimpleUser) {
      toast.error('You do not have permission to edit circuits');
      return;
    }
    onEdit(circuit);
  };

  const handleDelete = () => {
    if (isSimpleUser) {
      toast.error('You do not have permission to delete circuits');
      return;
    }
    onDelete(circuit);
  };

  return (
    <div className="flex justify-end gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost" 
            size="icon"
            className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/40"
            onClick={() => onViewDetails(circuit)}
          >
            {isSimpleUser ? <Info className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>View details</TooltipContent>
      </Tooltip>
      
      {!isSimpleUser && (
        <>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/40"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit circuit</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete circuit</TooltipContent>
          </Tooltip>
        </>
      )}
    </div>
  );
}
