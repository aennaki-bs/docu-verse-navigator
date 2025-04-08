
import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import circuitService from '@/services/circuitService';
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
import DeleteConfirmDialog from '@/components/admin/DeleteConfirmDialog';
import EditCircuitDetailDialog from './EditCircuitDetailDialog';

interface CircuitDetailsListProps {
  circuitDetails: CircuitDetail[];
  onUpdate: () => void;
}

export default function CircuitDetailsList({
  circuitDetails,
  onUpdate,
}: CircuitDetailsListProps) {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<CircuitDetail | null>(null);

  const handleEdit = (detail: CircuitDetail) => {
    setSelectedDetail(detail);
    setEditDialogOpen(true);
  };

  const handleDelete = (detail: CircuitDetail) => {
    setSelectedDetail(detail);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDetail) return;
    
    try {
      await circuitService.deleteCircuitDetail(selectedDetail.id);
      toast.success("Circuit step deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete circuit step");
      console.error(error);
    }
  };

  // Sort circuit details by order index
  const sortedDetails = [...circuitDetails].sort((a, b) => a.orderIndex - b.orderIndex);

  if (sortedDetails.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No steps defined for this circuit yet. Add a step to get started.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Step</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Responsible Role</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedDetails.map((detail) => (
            <TableRow key={detail.id}>
              <TableCell className="font-medium text-center">
                <Badge variant="outline">{detail.orderIndex + 1}</Badge>
              </TableCell>
              <TableCell className="font-mono text-xs">
                {detail.circuitDetailKey}
              </TableCell>
              <TableCell>{detail.title}</TableCell>
              <TableCell className="max-w-xs truncate">
                {detail.descriptif || 'No description'}
              </TableCell>
              <TableCell>
                {detail.responsibleRole ? (
                  <Badge>{detail.responsibleRole.name}</Badge>
                ) : (
                  <span className="text-gray-400">None</span>
                )}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(detail)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDelete(detail)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit & Delete Dialogs */}
      {selectedDetail && (
        <>
          <EditCircuitDetailDialog
            circuitDetail={selectedDetail}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={onUpdate}
          />
          
          <DeleteConfirmDialog
            title="Delete Circuit Step"
            description={`Are you sure you want to delete the step "${selectedDetail.title}"? This action cannot be undone.`}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={confirmDelete}
          />
        </>
      )}
    </div>
  );
}
