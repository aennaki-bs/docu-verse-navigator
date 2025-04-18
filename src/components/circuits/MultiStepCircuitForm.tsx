import { useCircuitForm } from '@/context/CircuitFormContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import StepOneTitle from './steps/StepOneTitle';
import StepTwoDescription from './steps/StepThreeSettings';
import StepThreeSettings from './steps/StepFourCircuitSteps';
import StepFourCircuitSteps from './steps/StepFiveReview';
import StepFiveReview from './steps/StepTwoDescription';

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex justify-center space-x-2 mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all
              ${step === currentStep
                ? 'bg-blue-600 text-white ring-4 ring-blue-600/20'
                : step < currentStep
                ? 'bg-blue-600/20 text-blue-600 border-2 border-blue-600'
                : 'bg-gray-800 text-gray-400 border border-gray-700'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < 5 && (
            <div
              className={`h-[2px] w-12 transition-colors
                ${step < currentStep ? 'bg-blue-600' : 'bg-gray-700'}`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

// Step title component
const StepTitle = ({ currentStep }: { currentStep: number }) => {
  const titles = [
    'Circuit Title',
    'Circuit Description',
    'Circuit Settings',
    'Circuit Steps (Optional)',
    'Review and Create'
  ];

  return (
    <h3 className="text-2xl font-semibold text-center text-white mb-6">{titles[currentStep - 1]}</h3>
  );
};

export default function MultiStepCircuitForm() {
  const { currentStep } = useCircuitForm();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOneTitle />;
      case 2:
        return <StepTwoDescription />;
      case 3:
        return <StepThreeSettings />;
      case 4:
        return <StepFourCircuitSteps />;
      case 5:
        return <StepFiveReview />;
      default:
        return <StepOneTitle />;
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto border-gray-800 bg-[#0d1117]">
      <CardHeader className="space-y-1 pb-2 border-b border-gray-800">
        <StepIndicator currentStep={currentStep} />
        <StepTitle currentStep={currentStep} />
      </CardHeader>
      
      <CardContent className="pt-6">
        {renderStep()}
      </CardContent>
    </Card>
  );
}
