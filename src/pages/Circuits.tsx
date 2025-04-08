
import CircuitsList from '@/components/circuits/CircuitsList';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon, ShieldAlert, AlertCircle, Lock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';

export default function CircuitsPage() {
  const { user } = useAuth();
  const [apiError, setApiError] = useState('');
  const isSimpleUser = user?.role === 'SimpleUser';

  // Clear any API errors when component mounts or when user changes
  useEffect(() => {
    setApiError('');
  }, [user]);

  // Function to handle API errors from child components
  const handleApiError = (errorMessage: string) => {
    setApiError(errorMessage);
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Circuit Management</h1>
        <p className="text-gray-500">
          {isSimpleUser ? 'View document workflow circuits' : 'Create and manage document workflow circuits'}
        </p>
      </div>
      
      {apiError && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {apiError}
          </AlertDescription>
        </Alert>
      )}
      
      <Alert variant={isSimpleUser ? "warning" : "default"} className={isSimpleUser ? "border-amber-500" : ""}>
        {isSimpleUser ? <Lock className="h-4 w-4" /> : <InfoIcon className="h-4 w-4" />}
        <AlertTitle>{isSimpleUser ? "View-Only Access" : "Access Control Information"}</AlertTitle>
        <AlertDescription>
          {isSimpleUser 
            ? "As a Simple User, you can only view circuits and their details. You cannot create, edit, or delete circuits or their steps."
            : "Only users with Admin and FullUser roles can make changes to circuits. SimpleUser role can only view circuits and documents."
          }
        </AlertDescription>
      </Alert>
      
      <CircuitsList onApiError={handleApiError} />
    </div>
  );
}
