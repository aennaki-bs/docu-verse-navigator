
import React from 'react';

interface StepTitleProps {
  currentStep: number;
}

const StepTitle: React.FC<StepTitleProps> = ({ currentStep }) => {
  const titles = [
    'Account Details',
    'Credentials',
    'Admin Access (Optional)',
    'Review Information'
  ];

  return (
    <h3 className="text-xl font-semibold text-white">{titles[currentStep - 1]}</h3>
  );
};

export default StepTitle;
