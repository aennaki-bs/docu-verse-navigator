import { ArrowLeft, Loader2, Save, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubTypeForm } from "./SubTypeFormProvider";

interface SubTypeFormActionsProps {
  onCancel: () => void;
}

export const SubTypeFormActions = ({ onCancel }: SubTypeFormActionsProps) => {
  const {
    currentStep,
    nextStep,
    prevStep,
    submitForm,
    isSubmitting,
    totalSteps,
  } = useSubTypeForm();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleNext = () => {
    nextStep();
  };

  const handlePrev = () => {
    prevStep();
  };

  const handleSubmit = async () => {
    if (isLastStep) {
      submitForm();
    } else {
      handleNext();
    }
  };

  return (
    <div className="flex justify-between mt-4 gap-3">
      <Button
        type="button"
        variant="outline"
        onClick={isFirstStep ? onCancel : handlePrev}
        className="flex-1 sm:flex-none px-3 py-2 text-sm bg-transparent border-blue-800/50 hover:bg-blue-900/30 text-gray-300 shadow-sm h-10"
        size="sm"
      >
        {isFirstStep ? (
          "Cancel"
        ) : (
          <>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </>
        )}
      </Button>

      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="flex-1 sm:flex-none px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-md h-10"
        size="sm"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isLastStep ? "Saving..." : "Processing..."}
          </>
        ) : isLastStep ? (
          <>
            <Save className="mr-2 h-4 w-4" />
            Create Subtype
          </>
        ) : (
          <>
            Continue
            <ChevronRight className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
};
