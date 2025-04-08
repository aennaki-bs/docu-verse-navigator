
import CircuitsList from '@/components/circuits/CircuitsList';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function CircuitsPage() {
  const { user } = useAuth();
  const isSimpleUser = user?.role === 'SimpleUser';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Circuit Management</h1>
        <p className="text-gray-500">
          Create and manage document workflow circuits
        </p>
      </div>
      
      <Alert variant={isSimpleUser ? "destructive" : "default"}>
        {isSimpleUser ? <ShieldAlert className="h-4 w-4" /> : <InfoIcon className="h-4 w-4" />}
        <AlertTitle>{isSimpleUser ? "Access Restricted" : "Access Control Information"}</AlertTitle>
        <AlertDescription>
          {isSimpleUser 
            ? "As a Simple User, you can only view circuits and documents. You cannot make any changes."
            : "Only users with Admin and FullUser roles can make changes to circuits. SimpleUser role can only view circuits and documents."
          }
        </AlertDescription>
      </Alert>
      
      <CircuitsList />
    </div>
  );
}
