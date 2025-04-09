
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import EditCircuitDialog from '../EditCircuitDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import CircuitDetailsDialog from '../CircuitDetailsDialog';
import { CircuitLoadingState } from './CircuitLoadingState';
import { CircuitEmptyState } from './CircuitEmptyState';
import { CircuitsTable } from './CircuitsTable';
import { useCircuitList } from './useCircuitList';

interface CircuitsListProps {
  onApiError?: (errorMessage: string) => void;
  searchQuery?: string;
}

export default function CircuitsList({ onApiError, searchQuery = '' }: CircuitsListProps) {
  const { user } = useAuth();
  const isSimpleUser = user?.role === 'SimpleUser';
  
  const {
    circuits,
    isLoading,
    isError,
    selectedCircuit,
    editDialogOpen,
    setEditDialogOpen,
    deleteDialogOpen,
    setDeleteDialogOpen,
    detailsDialogOpen,
    setDetailsDialogOpen,
    handleEdit,
    handleDelete,
    handleViewDetails,
    confirmDelete,
    refetch
  } = useCircuitList({ 
    onApiError, 
    searchQuery 
  });

  if (isLoading) {
    return <CircuitLoadingState />;
  }

  if (isError && !onApiError) {
    return <div className="text-red-500 p-8">Error loading circuits</div>;
  }

  return (
    <Card className="w-full shadow-md bg-[#111633]/70 border-blue-900/30">
      <CardHeader className="flex flex-row items-center justify-between border-b border-blue-900/30 bg-blue-900/20">
        <CardTitle className="text-xl text-blue-100">Circuits</CardTitle>
        {circuits && circuits.length > 0 && (
          <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700/50">
            {circuits.length} {circuits.length === 1 ? 'Circuit' : 'Circuits'}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {circuits && circuits.length > 0 ? (
          <CircuitsTable 
            circuits={circuits} 
            isSimpleUser={isSimpleUser}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
          />
        ) : (
          <CircuitEmptyState 
            searchQuery={searchQuery} 
            isSimpleUser={isSimpleUser} 
          />
        )}
      </CardContent>

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
