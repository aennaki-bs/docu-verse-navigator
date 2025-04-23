
import { useNavigate } from 'react-router-dom';
import { TableRow, TableCell } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Edit, MoreHorizontal, Trash, Eye, CircleCheck } from 'lucide-react';

interface StepTableRowProps {
  step: Step;
  isSelected: boolean;
  onSelectStep: (id: number, checked: boolean) => void;
  onDeleteStep?: (step: Step) => void;
  onEditStep?: (step: Step) => void;
  onViewDetails?: (step: Step) => void;
  circuitName?: string;
}

export const StepTableRow = ({
  step,
  isSelected,
  onSelectStep,
  onDeleteStep,
  onEditStep,
  onViewDetails,
  circuitName
}: StepTableRowProps) => {
  const navigate = useNavigate();

  const handleManageStatuses = () => {
    navigate(`/circuits/${step.circuitId}/steps/${step.id}/statuses`);
  };

  return (
    <TableRow className={isSelected ? 'bg-muted/30' : undefined}>
      <TableCell className="px-4 py-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectStep(step.id, !!checked)}
        />
      </TableCell>
      <TableCell className="px-4 py-2">{step.stepKey}</TableCell>
      <TableCell className="px-4 py-2 font-medium">{step.title}</TableCell>
      <TableCell className="px-4 py-2 hidden md:table-cell max-w-[200px] truncate">
        {step.descriptif}
      </TableCell>
      <TableCell className="px-4 py-2 hidden lg:table-cell">{circuitName || `Circuit #${step.circuitId}`}</TableCell>
      <TableCell className="px-4 py-2 hidden md:table-cell text-center">{step.orderIndex}</TableCell>
      <TableCell className="px-4 py-2 hidden lg:table-cell">
        {step.isFinalStep ? (
          <Badge className="bg-green-600">Final Step</Badge>
        ) : (
          <Badge variant="outline">Intermediate</Badge>
        )}
      </TableCell>
      <TableCell className="px-4 py-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <MoreHorizontal className="h-5 w-5" />
              <span className="sr-only">Actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-background border-blue-900/30">
            {onEditStep && (
              <DropdownMenuItem onClick={() => onEditStep(step)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={handleManageStatuses}>
              <CircleCheck className="mr-2 h-4 w-4" />
              Manage Statuses
            </DropdownMenuItem>
            {onViewDetails && (
              <DropdownMenuItem onClick={() => onViewDetails(step)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
            )}
            {(onEditStep || onViewDetails) && onDeleteStep && <DropdownMenuSeparator />}
            {onDeleteStep && (
              <DropdownMenuItem 
                onClick={() => onDeleteStep(step)}
                className="text-destructive focus:text-destructive"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
