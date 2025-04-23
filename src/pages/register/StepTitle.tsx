
import React from 'react';

interface StepTitleProps {
  currentStep: number;
  stepCount?: number;
}

const StepTitle: React.FC<StepTitleProps> = ({ currentStep, stepCount = 4 }) => {
  const getTitleForStep = (step: number, totalSteps: number) => {
    if (totalSteps === 5) { // Personal flow
      switch (step) {
        case 1: return 'Account Details';
        case 2: return 'Credentials';
        case 3: return 'Personal Address';
        case 4: return 'Admin Access (Optional)';
        case 5: return 'Review Information';
        default: return 'Account Details';
      }
    } else { // Company flow
      switch (step) {
        case 1: return 'Account Details';
        case 2: return 'Credentials';
        case 3: return 'Admin Access (Optional)';
        case 4: return 'Review Information';
        default: return 'Account Details';
      }
    }
  };

  return (
    <h3 className="text-xl font-semibold text-white">
      {getTitleForStep(currentStep, stepCount)}
    </h3>
  );
};

export default StepTitle;
