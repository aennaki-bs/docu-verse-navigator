
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { InfoIcon } from 'lucide-react';
import { CircuitFormProvider } from '@/context/CircuitFormContext';
import MultiStepCircuitForm from '@/components/circuits/MultiStepCircuitForm';

export default function CreateCircuitPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Create Circuit</h1>
        <p className="text-gray-500">Create a new document workflow circuit</p>
      </div>
      
      <Alert variant="default" className="mb-6">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Multi-step Creation</AlertTitle>
        <AlertDescription>
          Create your circuit in simple steps. You'll be able to define the title, description, settings, and optionally add workflow steps before finalizing.
        </AlertDescription>
      </Alert>
      
      <CircuitFormProvider>
        <MultiStepCircuitForm />
      </CircuitFormProvider>
    </div>
  );
}
