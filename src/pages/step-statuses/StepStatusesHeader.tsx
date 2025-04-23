
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';

interface StepStatusesHeaderProps {
  circuitId: string;
  circuitTitle: string;
  stepTitle: string;
  circuitDetailKey?: string;
  isSimpleUser: boolean;
  onAddStatus: () => void;
}

export function StepStatusesHeader({
  circuitId,
  circuitTitle,
  stepTitle,
  circuitDetailKey,
  isSimpleUser,
  onAddStatus
}: StepStatusesHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/circuits/${circuitId}/steps`}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-blue-200 to-purple-200 text-transparent bg-clip-text truncate">
            {stepTitle} - Statuses
          </h1>
        </div>
        <p className="text-gray-400 mt-1 text-sm">
          Circuit: <span className="text-blue-300">{circuitTitle}</span> | Step: <span className="font-mono text-blue-300">{circuitDetailKey}</span>
        </p>
      </div>
      {!isSimpleUser && (
        <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={onAddStatus}>
          <Plus className="mr-2 h-4 w-4" /> Add Status
        </Button>
      )}
    </div>
  )
}
