
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

interface CircuitStepsHeaderProps {
  circuit: Circuit;
  onAddStep: () => void;
  isSimpleUser: boolean;
}

export const CircuitStepsHeader = ({
  circuit,
  onAddStep,
  isSimpleUser
}: CircuitStepsHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to="/circuits">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-3xl font-semibold bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text">
            {circuit.title} - Steps
          </h1>
        </div>
        <p className="text-gray-400 mt-1">
          Circuit Code: <span className="font-mono text-blue-300">{circuit.circuitKey}</span>
        </p>
      </div>
      
      {!isSimpleUser && (
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700" onClick={onAddStep}>
          <Plus className="mr-2 h-4 w-4" /> Add Step
        </Button>
      )}
    </div>
  );
};
