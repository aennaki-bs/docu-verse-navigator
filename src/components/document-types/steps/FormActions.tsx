
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2, Save } from 'lucide-react';

interface FormActionsProps {
  step: number;
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
  isEditMode,
  onNext,
  onPrev,
  onSubmit,
  onCancel,
  isNextDisabled,
  isValidating,
}: FormActionsProps) => {
  const isFirstStep = step === 1;
  const isLastStep = step === 2;

  return (
    <div className="flex justify-between gap-2 mt-4">
      <Button
        type="button"
        variant="outline"
        onClick={isFirstStep ? onCancel : onPrev}
        className="h-7 text-xs bg-transparent border-blue-800/50 hover:bg-blue-900/30 text-gray-300"
        size="sm"
      >
        {isFirstStep ? 'Cancel' : (
          <>
            <ArrowLeft className="mr-1 h-2.5 w-2.5" />
            Back
          </>
        )}
      </Button>

      <Button
        type="button"
        onClick={isLastStep || isEditMode ? onSubmit : onNext}
        disabled={isNextDisabled || isValidating}
        className="h-7 text-xs bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white"
        size="sm"
      >
        {isValidating ? (
          <>
            <Loader2 className="mr-1 h-2.5 w-2.5 animate-spin" />
            Validating...
          </>
        ) : isLastStep || isEditMode ? (
          <>
            <Save className="mr-1 h-2.5 w-2.5" />
            {isEditMode ? 'Update Type' : 'Create Type'}
          </>
        ) : (
          'Continue'
        )}
      </Button>
    </div>
  );
};
