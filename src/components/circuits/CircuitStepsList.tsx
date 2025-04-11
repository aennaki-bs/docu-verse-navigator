
import { useState } from 'react';
import { Edit, Trash2, Info, Lock, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';
import { useAuth } from '@/context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import EditCircuitStepDialog from './EditCircuitStepDialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Step } from '@/models/circuit';

interface CircuitStepsListProps {
  steps: Step[];
  onUpdate: () => void;
}

export default function CircuitStepsList({
  steps,
  onUpdate,
}: CircuitStepsListProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const { user } = useAuth();
  const isSimpleUser = user?.role === 'SimpleUser';

  const handleEdit = (step: Step) => {
    if (isSimpleUser) {
      toast.error('You do not have permission to edit circuit steps');
      return;
    }
    setSelectedStep(step);
    setEditDialogOpen(true);
  };

  const handleDelete = (step: Step) => {
    if (isSimpleUser) {
      toast.error('You do not have permission to delete circuit steps');
      return;
    }
    setSelectedStep(step);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedStep) return;
    
    try {
      await circuitService.deleteStep(selectedStep.id);
      toast.success("Circuit step deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete circuit step");
      console.error(error);
    }
  };

  // Sort steps by order index
  const sortedSteps = [...steps].sort((a, b) => a.orderIndex - b.orderIndex);

  if (sortedSteps.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No steps defined for this circuit yet. {!isSimpleUser && 'Add a step to get started.'}
      </div>
    );
  }
  
  const headerContent = isSimpleUser ? (
    <div className="flex items-center text-sm px-4 py-2 text-gray-500">
      <Lock className="h-4 w-4 mr-2" /> View-only access
    </div>
  ) : null;

  return (
    <div className="rounded-md border">
      {headerContent}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Step</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Responsible Role</TableHead>
            <TableHead>Final Step</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSteps.map((step) => (
            <TableRow key={step.id}>
              <TableCell className="font-medium text-center">
                <Badge variant="outline">{step.orderIndex + 1}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">
                {step.stepKey}
              </TableCell>
              <TableCell>{step.title}</TableCell>
              <TableCell className="max-w-xs truncate">
                {step.descriptif || 'No description'}
              </TableCell>
              <TableCell>
                {step.responsibleRole ? (
                  <Badge>{step.responsibleRole.name}</Badge>
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </TableCell>
              <TableCell>
                {step.isFinalStep ? (
                  <Badge className="bg-green-500/20 text-green-200">Yes</Badge>
                ) : (
                  <span className="text-gray-400">No</span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                {isSimpleUser ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Info className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>View details only</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(step)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(step)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit & Delete Dialogs - Only render if user has permissions */}
      {selectedStep && !isSimpleUser && (
        <>
          <EditCircuitStepDialog
            step={selectedStep}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={onUpdate}
          />
          
          <DeleteConfirmDialog
            title="Delete Circuit Step"
            description={`Are you sure you want to delete the step "${selectedStep.title}"? This action cannot be undone.`}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={confirmDelete}
          />
        </>
      )}
    </div>
  );
}
