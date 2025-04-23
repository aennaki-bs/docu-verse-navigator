
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MultiStepFormContext from './MultiStepFormContext';
import { FormData, StepValidation, initialFormData } from './types';
import { 
  validateUsername as validateUsernameUtil, 
  validateEmail as validateEmailUtil,
  debounceUsernameValidation,
  debounceEmailValidation
} from './utils/validationUtils';
import { registerUser as registerUserUtil, verifyEmail as verifyEmailUtil } from './utils/registerUtils';

export const MultiStepFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormDataState] = useState<FormData>(initialFormData);
  const [stepValidation, setStepValidation] = useState<StepValidation>({
    isLoading: false,
    errors: {},
  });
  const navigate = useNavigate();

  // Use debounced validation for username and email as they change
  useEffect(() => {
    if (formData.username && formData.username.length >= 4) {
      debounceUsernameValidation(formData.username, setStepValidation);
    }
  }, [formData.username]);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && emailRegex.test(formData.email)) {
      debounceEmailValidation(formData.email, setStepValidation);
    }
  }, [formData.email]);

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
    
    // Clear registration error when user updates any field
    // This allows resubmission after fixing the error
    if (stepValidation.errors.registration) {
      setStepValidation((prev) => ({ 
        ...prev, 
        errors: { ...prev.errors, registration: undefined } 
      }));
    }
  };

  // Next step logic, handle extra steps.
  const nextStep = () => {
    // Clear validation errors when moving to next step
    setFormData({ validationError: "" });
    
    // Personal flow: 1. Info, 2. Credentials, 3. Address, 4. Admin Key, 5. Summary
    if (formData.userType === 'personal') {
      if (currentStep < 5) setCurrentStep(currentStep + 1);
    }
    // Company flow: 1. Info, 2. Credentials, 3. Admin Key, 4. Summary
    else if (formData.userType === 'company') {
      if (currentStep < 4) setCurrentStep(currentStep + 1);
    }
  };

  // Previous step logic
  const prevStep = () => {
    // Clear validation errors when moving back
    setFormData({ validationError: "" });
    
    if (formData.userType === 'personal') {
      if (currentStep > 1) setCurrentStep(currentStep - 1);
    } else if (formData.userType === 'company') {
      if (currentStep > 1) setCurrentStep(currentStep - 1);
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormDataState(initialFormData);
    setStepValidation({ isLoading: false, errors: {} });
  };

  const validateUsername = async (): Promise<boolean> => {
    return validateUsernameUtil(formData.username, setStepValidation);
  };

  const validateEmail = async (): Promise<boolean> => {
    return validateEmailUtil(formData.email, setStepValidation);
  };

  const registerUser = async (): Promise<boolean> => {
    // Clear any previous validation errors
    setFormData({ validationError: "" });
    return registerUserUtil(formData, setStepValidation, navigate);
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    return verifyEmailUtil(formData.email, code, setStepValidation, navigate);
  };

  return (
    <MultiStepFormContext.Provider
      value={{
        currentStep,
        formData,
        stepValidation,
        nextStep,
        prevStep,
        setCurrentStep,
        setFormData,
        validateUsername,
        validateEmail,
        registerUser,
        verifyEmail,
        resetForm,
      }}
    >
      {children}
    </MultiStepFormContext.Provider>
  );
};
