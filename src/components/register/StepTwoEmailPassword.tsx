
import React, { useState } from 'react';
import { useMultiStepForm } from '@/context/MultiStepFormContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ArrowRight, ChevronLeft } from 'lucide-react';
import UsernameField from './fields/UsernameField';
import EmailField from './fields/EmailField';
import PasswordFields from './fields/PasswordFields';
import { validateEmailPasswordStep } from './utils/validation';

const StepTwoEmailPassword = () => {
  const { formData, setFormData, prevStep, nextStep, validateEmail, validateUsername, stepValidation } = useMultiStepForm();
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
    
    // Clear error when field is edited
    if (localErrors[name]) {
      setLocalErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateStep = () => {
    const errors = validateEmailPasswordStep(formData);
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      toast.error("Please correct all errors before proceeding");
      return;
    }

    try {
      // Validate username first
      const isUsernameValid = await validateUsername();
      if (!isUsernameValid) {
        return;
      }

      // If username is valid, proceed to validate email
      const isEmailValid = await validateEmail();
      if (!isEmailValid) {
        return;
      }

      // If both validations are successful, proceed to next step
      nextStep();
    } catch (error) {
      toast.error("An error occurred during validation.");
      console.error("Validation error:", error);
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 mb-2">
        <UsernameField
          value={formData.username}
          onChange={handleChange}
          localErrors={localErrors}
          validationErrors={stepValidation.errors}
        />
        
        <EmailField
          value={formData.email}
          onChange={handleChange}
          localErrors={localErrors}
          validationErrors={stepValidation.errors}
        />
        
        <PasswordFields
          password={formData.password}
          confirmPassword={formData.confirmPassword}
          onChange={handleChange}
          localErrors={localErrors}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button
          type="button"
          className="flex-1"
          variant="outline"
          onClick={prevStep}
          disabled={stepValidation.isLoading}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          type="button"
          className="flex-1 bg-docuBlue hover:bg-docuBlue-700"
          onClick={handleNext}
          disabled={stepValidation.isLoading}
        >
          {stepValidation.isLoading ? (
            <span className="flex items-center">Validating...</span>
          ) : (
            <span className="flex items-center">
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StepTwoEmailPassword;
