
import { useCircuitForm } from '@/context/CircuitFormContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import StepOneBasicInfo from './steps/StepOneBasicInfo';
import StepTwoCircuitSteps from './steps/StepTwoCircuitSteps';
import StepThreeReview from './steps/StepThreeReview';

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex justify-center mb-6">
      {[1, 2, 3].map((step) => (
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
          {step < 3 && (
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
    'Circuit Information',
    'Circuit Steps',
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
        return <StepOneBasicInfo />;
      case 2:
        return <StepTwoCircuitSteps />;
      case 3:
        return <StepThreeReview />;
      default:
        return <StepOneBasicInfo />;
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
