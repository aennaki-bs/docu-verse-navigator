
import React, { useState, useEffect } from 'react';
import { useMultiStepForm } from '@/context/form';
import { toast } from 'sonner';
import { validateEmailPasswordStep } from './utils/validation';
import { usePasswordStrength } from './hooks/usePasswordStrength';
import StepTwoFormFields from './step-two/StepTwoFormFields';
import StepTwoButtons from './step-two/StepTwoButtons';

const StepTwoEmailPassword = () => {
  const { formData, setFormData, prevStep, nextStep, validateEmail, validateUsername, stepValidation } = useMultiStepForm();
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
  const [hasInteracted, setHasInteracted] = useState({
    username: false,
    email: false,
    password: false,
    confirmPassword: false
  });

  const { calculatePasswordStrength } = usePasswordStrength();
  const passwordStrength = calculatePasswordStrength(formData.password);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
    
    if (!hasInteracted[name as keyof typeof hasInteracted]) {
      setHasInteracted(prev => ({
        ...prev,
        [name]: true
      }));
    }
    
    validateField(name);
  };
  
  const validateField = (fieldName: string) => {
    const errors = validateEmailPasswordStep(formData);
    
    setLocalErrors(prev => {
      const updatedErrors = { ...prev };
      if (hasInteracted[fieldName as keyof typeof hasInteracted]) {
        if (errors[fieldName]) {
          updatedErrors[fieldName] = errors[fieldName];
        } else {
          delete updatedErrors[fieldName];
        }
      }
      return updatedErrors;
    });
  };

  const validateStep = (showToast = true) => {
    const errors = validateEmailPasswordStep(formData);
    
    const filteredErrors: Record<string, string> = {};
    Object.keys(errors).forEach(key => {
      if (hasInteracted[key as keyof typeof hasInteracted]) {
        filteredErrors[key] = errors[key];
      }
    });
    
    setLocalErrors(filteredErrors);
    
    if (showToast && Object.keys(filteredErrors).length > 0) {
      toast.error("Please correct all errors before proceeding");
    }
    
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    Object.keys(hasInteracted).forEach(field => {
      if (hasInteracted[field as keyof typeof hasInteracted]) {
        validateField(field);
      }
    });
  }, [formData, hasInteracted]);

  const handleNext = async () => {
    setHasInteracted({
      username: true,
      email: true,
      password: true,
      confirmPassword: true
    });
    
    if (!validateStep()) {
      return;
    }

    try {
      const isUsernameValid = await validateUsername();
      if (!isUsernameValid) {
        return;
      }

      const isEmailValid = await validateEmail();
      if (!isEmailValid) {
        return;
      }

      nextStep();
    } catch (error) {
      toast.error("An error occurred during validation.");
      console.error("Validation error:", error);
    }
  };

  return (
    <div className="space-y-5">
      <StepTwoFormFields
        formData={formData}
        onChange={handleChange}
        localErrors={localErrors}
        validationErrors={stepValidation.errors}
        passwordStrength={passwordStrength}
      />

      <StepTwoButtons
        onBack={prevStep}
        onNext={handleNext}
        isLoading={stepValidation.isLoading}
      />
    </div>
  );
};

export default StepTwoEmailPassword;
