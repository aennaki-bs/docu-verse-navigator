
import { useParams } from 'react-router-dom';
import { CircuitDetailsList } from '@/components/circuits/CircuitDetailsList';

export function CircuitDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div className="p-4">Circuit ID not found</div>;
  }

  return (
    <div className="p-4">
      <CircuitDetailsList circuitId={parseInt(id)} />
    </div>
  );
}
