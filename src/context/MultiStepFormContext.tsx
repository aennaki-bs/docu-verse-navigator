
import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';
import authService from '@/services/authService';

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminSecretKey?: string;
}

interface StepValidation {
  isLoading: boolean;
  errors: Record<string, string>;
}

interface MultiStepFormContextType {
  currentStep: number;
  formData: FormData;
  stepValidation: StepValidation;
  nextStep: () => void;
  prevStep: () => void;
  setFormData: (data: Partial<FormData>) => void;
  validateUsername: () => Promise<boolean>;
  validateEmail: () => Promise<boolean>;
  registerUser: () => Promise<boolean>;
  verifyEmail: (code: string) => Promise<boolean>;
  resetForm: () => void;
}

const initialFormData: FormData = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  adminSecretKey: '',
};

const MultiStepFormContext = createContext<MultiStepFormContextType>({
  currentStep: 1,
  formData: initialFormData,
  stepValidation: { isLoading: false, errors: {} },
  nextStep: () => {},
  prevStep: () => {},
  setFormData: () => {},
  validateUsername: async () => false,
  validateEmail: async () => false,
  registerUser: async () => false,
  verifyEmail: async () => false,
  resetForm: () => {},
});

export const useMultiStepForm = () => useContext(MultiStepFormContext);

export const MultiStepFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormDataState] = useState<FormData>(initialFormData);
  const [stepValidation, setStepValidation] = useState<StepValidation>({
    isLoading: false,
    errors: {},
  });

  const setFormData = (data: Partial<FormData>) => {
    setFormDataState((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const resetForm = () => {
    setCurrentStep(1);
    setFormDataState(initialFormData);
    setStepValidation({ isLoading: false, errors: {} });
  };

  const validateUsername = async (): Promise<boolean> => {
    setStepValidation((prev) => ({ ...prev, isLoading: true, errors: {} }));
    try {
      // Call API to validate username
      await authService.validateUsername(formData.username);
      setStepValidation((prev) => ({ ...prev, isLoading: false }));
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Username validation failed.';
      setStepValidation((prev) => ({
        ...prev,
        isLoading: false,
        errors: { username: errorMessage },
      }));
      toast.error(errorMessage);
      return false;
    }
  };

  const validateEmail = async (): Promise<boolean> => {
    setStepValidation((prev) => ({ ...prev, isLoading: true, errors: {} }));
    try {
      // Call API to validate email
      await authService.validateEmail(formData.email);
      setStepValidation((prev) => ({ ...prev, isLoading: false }));
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Email validation failed.';
      setStepValidation((prev) => ({
        ...prev,
        isLoading: false,
        errors: { email: errorMessage },
      }));
      toast.error(errorMessage);
      return false;
    }
  };

  const registerUser = async (): Promise<boolean> => {
    setStepValidation((prev) => ({ ...prev, isLoading: true, errors: {} }));
    try {
      // Call API to register user
      await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        username: formData.username,
        adminSecretKey: formData.adminSecretKey,
      });
      setStepValidation((prev) => ({ ...prev, isLoading: false }));
      toast.success('Registration successful! Please check your email for verification.');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed.';
      setStepValidation((prev) => ({
        ...prev,
        isLoading: false,
        errors: { registration: errorMessage },
      }));
      toast.error(errorMessage);
      return false;
    }
  };

  const verifyEmail = async (code: string): Promise<boolean> => {
    setStepValidation((prev) => ({ ...prev, isLoading: true, errors: {} }));
    try {
      // Call API to verify email
      await authService.verifyEmail(formData.email, code);
      setStepValidation((prev) => ({ ...prev, isLoading: false }));
      toast.success('Email verified successfully!');
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Email verification failed.';
      setStepValidation((prev) => ({
        ...prev,
        isLoading: false,
        errors: { verification: errorMessage },
      }));
      toast.error(errorMessage);
      return false;
    }
  };

  return (
    <MultiStepFormContext.Provider
      value={{
        currentStep,
        formData,
        stepValidation,
        nextStep,
        prevStep,
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
