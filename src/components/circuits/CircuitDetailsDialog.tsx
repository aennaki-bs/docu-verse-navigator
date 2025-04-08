
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import circuitService from '@/services/circuitService';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CircuitDetailsList from './CircuitDetailsList';
import CreateCircuitDetailDialog from './CreateCircuitDetailDialog';

interface CircuitDetailsDialogProps {
  circuit: Circuit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CircuitDetailsDialog({
  circuit,
  open,
  onOpenChange,
}: CircuitDetailsDialogProps) {
  const [createDetailDialogOpen, setCreateDetailDialogOpen] = useState(false);
  
  const { 
    data: circuitDetails,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['circuit-details', circuit.id],
    queryFn: () => circuitService.getCircuitDetailsByCircuitId(circuit.id),
    enabled: open
  });

  useEffect(() => {
    if (open) {
      refetch();
    }
  }, [open, refetch]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Circuit Details: {circuit.title}</span>
            <Button onClick={() => setCreateDetailDialogOpen(true)} size="sm">
              <Plus className="mr-2 h-4 w-4" /> Add Step
            </Button>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : isError ? (
          <div className="text-red-500 p-4">
            Error loading circuit details
          </div>
        ) : (
          <CircuitDetailsList 
            circuitDetails={circuitDetails || []} 
            onUpdate={refetch}
          />
        )}
        
        {/* Create Circuit Detail Dialog */}
        <CreateCircuitDetailDialog
          circuitId={circuit.id}
          open={createDetailDialogOpen}
          onOpenChange={setCreateDetailDialogOpen}
          onSuccess={() => {
            refetch();
            toast.success("Circuit step added successfully");
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
