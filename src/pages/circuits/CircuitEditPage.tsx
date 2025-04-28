
import { useParams } from 'react-router-dom';
import EditCircuitDialog from '@/components/circuits/EditCircuitDialog';

export default function CircuitEditPage() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div className="p-4">Circuit ID not found</div>;
  }

  return (
    <div className="p-4">
      <EditCircuitDialog circuitId={parseInt(id)} />
    </div>
  );
}
