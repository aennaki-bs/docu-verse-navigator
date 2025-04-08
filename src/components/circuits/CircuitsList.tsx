import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { Edit, Trash2, FileText, Info } from 'lucide-react';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EditCircuitDialog from './EditCircuitDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import CircuitDetailsDialog from './CircuitDetailsDialog';
import { useAuth } from '@/context/AuthContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CircuitsListProps {
  onApiError?: (errorMessage: string) => void;
}

export default function CircuitsList({ onApiError }: CircuitsListProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedCircuit, setSelectedCircuit] = useState<Circuit | null>(null);
  const { user } = useAuth();
  const isSimpleUser = user?.role === 'SimpleUser';

  const { data: circuits, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['circuits'],
    queryFn: circuitService.getAllCircuits,
  });

  // Report any API errors to the parent component
  if (isError && onApiError) {
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Failed to load circuits. Please try again later.';
    onApiError(errorMessage);
  }

  const handleEdit = (circuit: Circuit) => {
    if (isSimpleUser) {
      toast.error('You do not have permission to edit circuits');
      return;
    }
    setSelectedCircuit(circuit);
    setEditDialogOpen(true);
  };

  const handleDelete = (circuit: Circuit) => {
    if (isSimpleUser) {
      toast.error('You do not have permission to delete circuits');
      return;
    }
    setSelectedCircuit(circuit);
    setDeleteDialogOpen(true);
  };

  const handleViewDetails = (circuit: Circuit) => {
    setSelectedCircuit(circuit);
    setDetailsDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCircuit) return;
    
    try {
      await circuitService.deleteCircuit(selectedCircuit.id);
      toast.success("Circuit deleted successfully");
      refetch();
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to delete circuit';
      toast.error(errorMessage);
      if (onApiError) onApiError(errorMessage);
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading circuits...</div>;
  }

  if (isError && !onApiError) {
    return <div className="text-red-500 p-8">Error loading circuits</div>;
  }

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Circuits</CardTitle>
      </CardHeader>
      <CardContent>
        {circuits && circuits.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Circuit Key</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Flow Type</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {circuits.map((circuit) => (
                  <TableRow key={circuit.id}>
                    <TableCell className="font-medium">{circuit.circuitKey}</TableCell>
                    <TableCell>{circuit.title}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {circuit.descriptif || 'No description'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={circuit.isActive ? "default" : "secondary"}>
                        {circuit.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {circuit.hasOrderedFlow ? 'Sequential' : 'Parallel'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(circuit)}
                      >
                        {isSimpleUser ? <Info className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                      </Button>
                      
                      {!isSimpleUser && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(circuit)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDelete(circuit)}
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
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No circuits found. {!isSimpleUser && 'Create a new circuit to get started.'}
          </div>
        )}
      </CardContent>

      {/* Dialogs - Only render if user has permissions */}
      {selectedCircuit && (
        <>
          {!isSimpleUser && (
            <>
              <EditCircuitDialog
                circuit={selectedCircuit}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
                onSuccess={refetch}
              />
              
              <DeleteConfirmDialog
                title="Delete Circuit"
                description={`Are you sure you want to delete the circuit "${selectedCircuit.title}"? This action cannot be undone.`}
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={confirmDelete}
              />
            </>
          )}
          
          <CircuitDetailsDialog
            circuit={selectedCircuit}
            open={detailsDialogOpen}
            onOpenChange={setDetailsDialogOpen}
          />
        </>
      )}
    </Card>
  );
}
