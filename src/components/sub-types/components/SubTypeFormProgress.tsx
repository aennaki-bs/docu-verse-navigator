import { CheckCircle } from "lucide-react";
import { useSubTypeForm } from "./SubTypeFormProvider";

export const SubTypeFormProgress = () => {
  const { currentStep, totalSteps } = useSubTypeForm();
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Basic Info";
      case 2:
        return "Document Type";
      case 3:
        return "Date & Status";
      default:
        return "";
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1:
        return "Enter the basic information";
      case 2:
        return "Select document type";
      case 3:
        return "Set dates and status";
      default:
        return "";
    }
  };

  return (
    <div className="mb-6">
      {/* Step counter */}
      <div className="text-center mb-3">
        <span className="text-xs text-blue-400">
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      {/* Step indicators */}
      <div className="flex justify-center items-center mb-3">
        {steps.map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`flex items-center justify-center h-8 w-8 rounded-full transition-all duration-300
                ${
                  step === currentStep
                    ? "bg-blue-600 text-white ring-2 ring-blue-600/30 shadow-md"
                    : step < currentStep
                    ? "bg-blue-600 text-white border border-blue-500"
                    : "bg-gray-800/70 text-gray-400 border border-gray-700"
                }`}
            >
              {step < currentStep ? (
                <CheckCircle className="h-4 w-4 text-white" />
              ) : (
                <span className="text-sm font-medium">{step}</span>
              )}
            </div>

            {step !== steps.length && (
              <div
                className={`h-[2px] w-6 sm:w-8 md:w-10 transition-all duration-300
                  ${step < currentStep ? "bg-blue-600" : "bg-gray-700"}`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step title */}
      <p className="text-center text-base font-semibold text-blue-300 mb-1">
        {getStepTitle(currentStep)}
      </p>
      <p className="text-center text-sm text-gray-400 mb-2">
        {getStepDescription(currentStep)}
      </p>
    </div>
  );
};
