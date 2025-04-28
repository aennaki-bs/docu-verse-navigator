
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import EditCircuitDialog from '@/components/circuits/EditCircuitDialog';
import circuitService from '@/services/circuitService';

export default function CircuitEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [circuit, setCircuit] = useState<Circuit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCircuit = async () => {
      if (!id) return;
      
      try {
        const fetchedCircuit = await circuitService.getCircuitById(parseInt(id));
        setCircuit(fetchedCircuit);
      } catch (error) {
        console.error("Error fetching circuit:", error);
        toast.error("Failed to load circuit details");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCircuit();
  }, [id]);
  
  if (!id) {
    return <div className="p-4">Circuit ID not found</div>;
  }
  
  if (isLoading) {
    return <div className="p-4">Loading circuit details...</div>;
  }
  
  if (!circuit) {
    return <div className="p-4">Circuit not found</div>;
  }

  return (
    <div className="p-4">
      <EditCircuitDialog 
        circuit={circuit}
        open={true}
        onOpenChange={() => navigate(`/circuits/${id}`)}
        onSuccess={() => {
          toast.success("Circuit updated successfully");
          navigate(`/circuits/${id}`);
        }}
      />
    </div>
  );
}
