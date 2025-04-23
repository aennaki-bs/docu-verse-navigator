
import { CheckCircle } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
}

export const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center items-center mb-3">
      <div className="flex items-center">
        <div
          className={`flex items-center justify-center h-5 w-5 rounded-full transition-all duration-300
            ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
        >
          {currentStep > 1 ? (
            <CheckCircle className="h-3 w-3 text-white" />
          ) : (
            <span className="text-xs font-medium">1</span>
          )}
        </div>
        
        <div
          className={`h-[2px] w-8 transition-all duration-300
            ${currentStep > 1 ? 'bg-blue-600' : 'bg-gray-700'}`}
        />
        
        <div
          className={`flex items-center justify-center h-5 w-5 rounded-full transition-all duration-300
            ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'}`}
        >
          <span className="text-xs font-medium">2</span>
        </div>
      </div>
    </div>
  );
};
