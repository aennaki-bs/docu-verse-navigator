
import { Link } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';

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
  return (
    <>
      <Link to={`/circuits/${circuit.id}/steps`}>
        <Button 
          variant="ghost" 
          size="sm"
          className="text-blue-400 hover:text-blue-600 hover:bg-blue-100/10"
        >
          <Eye className="h-4 w-4" />
        </Button>
      </Link>
      
      {!isSimpleUser && (
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(circuit)}
            className="text-blue-400 hover:text-blue-600 hover:bg-blue-100/10"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(circuit)}
            className="text-red-400 hover:text-red-600 hover:bg-red-100/10"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-400 hover:text-blue-600 hover:bg-blue-100/10"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40 bg-blue-950 border-blue-800">
          <DropdownMenuItem 
            className="cursor-pointer text-blue-300 hover:text-blue-100 focus:bg-blue-800 focus:text-blue-100"
            onClick={() => onViewDetails(circuit)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          {!isSimpleUser && (
            <>
              <DropdownMenuItem 
                className="cursor-pointer text-blue-300 hover:text-blue-100 focus:bg-blue-800 focus:text-blue-100"
                onClick={() => onEdit(circuit)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-red-400 hover:text-red-300 focus:bg-red-900/40 focus:text-red-200"
                onClick={() => onDelete(circuit)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
