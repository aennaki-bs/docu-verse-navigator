
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

interface FormActionsProps {
  step: number;
  totalSteps: number;
  isEditMode: boolean;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  onCancel: () => void;
  isNextDisabled: boolean;
  isValidating: boolean;
}

export const FormActions = ({
  step,
  totalSteps,
  isEditMode,
  onNext,
  onPrev,
  onSubmit,
  onCancel,
  isNextDisabled,
  isValidating,
}: FormActionsProps) => {
  const isFirstStep = step === 1;
  const isLastStep = step === totalSteps;

  return (
    <div className="flex justify-between gap-2 mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={isFirstStep ? onCancel : onPrev}
        className="h-8 text-xs bg-transparent border-blue-800/50 hover:bg-blue-900/30 text-gray-300"
        size="sm"
      >
        {isFirstStep ? 'Cancel' : (
          <>
            <ArrowLeft className="mr-1 h-3 w-3" />
            Back
          </>
        )}
      </Button>

      <Button
        type="button"
        onClick={isLastStep ? onSubmit : onNext}
        disabled={isNextDisabled || isValidating}
        className={`h-8 text-xs ${
          isNextDisabled || isValidating
            ? 'bg-blue-800/50 text-gray-400 cursor-not-allowed' 
            : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white'
        }`}
        size="sm"
      >
        {isValidating ? (
          <>
            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            Validating...
          </>
        ) : isLastStep ? (
          <>
            <Save className="mr-1 h-3 w-3" />
            {isEditMode ? 'Update Type' : 'Create Type'}
          </>
        ) : (
          'Continue'
        )}
      </Button>
    </div>
  );
};
