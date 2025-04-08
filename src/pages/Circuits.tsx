
import CircuitsList from '@/components/circuits/CircuitsList';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';

export default function CircuitsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Circuit Management</h1>
        <p className="text-gray-500">
          Create and manage document workflow circuits
        </p>
      </div>
      
      <Alert>
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Access Control Information</AlertTitle>
        <AlertDescription>
          Only users with Admin and FullUser roles can make changes to circuits.
          SimpleUser role can only view circuits and documents.
        </AlertDescription>
      </Alert>
      
      <CircuitsList />
    </div>
  );
}
