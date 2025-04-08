
import { useCircuitForm } from '@/context/CircuitFormContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import StepOneTitle from './steps/StepOneTitle';
import StepTwoDescription from './steps/StepTwoDescription';
import StepThreeSettings from './steps/StepThreeSettings';
import StepFourCircuitSteps from './steps/StepFourCircuitSteps';
import StepFiveReview from './steps/StepFiveReview';

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex justify-center mb-6">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === currentStep
                ? 'bg-primary text-primary-foreground'
                : step < currentStep
                ? 'bg-primary/20 text-primary border border-primary'
                : 'bg-muted text-muted-foreground border border-input'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < 5 && (
            <div
              className={`h-1 w-10 ${
                step < currentStep ? 'bg-primary' : 'bg-muted'
              }`}
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
    <h3 className="text-xl font-semibold text-center">{titles[currentStep - 1]}</h3>
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
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="space-y-1 pb-2">
        <StepIndicator currentStep={currentStep} />
        <StepTitle currentStep={currentStep} />
      </CardHeader>
      
      <CardContent>
        {renderStep()}
      </CardContent>
    </Card>
  );
}
