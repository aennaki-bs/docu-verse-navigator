
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
      const isValid = await authService.validateUsername(formData.username);
      
      if (!isValid) {
        setStepValidation((prev) => ({
          ...prev,
          isLoading: false,
          errors: { username: 'Username validation failed. This username may already be taken.' },
        }));
        toast.error('Username validation failed. This username may already be taken.');
        return false;
      }
      
      setStepValidation((prev) => ({ ...prev, isLoading: false }));
      return true;
    } catch (error: any) {
      console.error('Username validation error:', error);
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
      const isValid = await authService.validateEmail(formData.email);
      
      if (!isValid) {
        setStepValidation((prev) => ({
          ...prev,
          isLoading: false,
          errors: { email: 'Email validation failed. This email may already be registered.' },
        }));
        toast.error('Email validation failed. This email may already be registered.');
        return false;
      }
      
      setStepValidation((prev) => ({ ...prev, isLoading: false }));
      return true;
    } catch (error: any) {
      console.error('Email validation error:', error);
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
      console.log("Registering user with data:", {
        email: formData.email,
        passwordHash: formData.password,
        confirmPassword: formData.confirmPassword,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        adminSecretKey: formData.adminSecretKey ? formData.adminSecretKey : undefined
      });
      
      // Call API to register user
      const response = await authService.register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        passwordHash: formData.password,
        confirmPassword: formData.confirmPassword,
        username: formData.username,
        adminSecretKey: formData.adminSecretKey,
      });
      
      console.log("Registration response:", response);
      
      setStepValidation((prev) => ({ ...prev, isLoading: false }));
      toast.success('Registration successful! Please check your email for verification.');
      
      // Return true to indicate successful registration
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data || 'Registration failed.';
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
      const isVerified = await authService.verifyEmail(formData.email, code);
      
      if (!isVerified) {
        setStepValidation((prev) => ({
          ...prev,
          isLoading: false,
          errors: { verification: 'Email verification failed. The code may be invalid or expired.' },
        }));
        toast.error('Email verification failed. The code may be invalid or expired.');
        return false;
      }
      
      setStepValidation((prev) => ({ ...prev, isLoading: false }));
      toast.success('Email verified successfully!');
      return true;
    } catch (error: any) {
      console.error('Email verification error:', error);
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
