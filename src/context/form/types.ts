
import { Dispatch, SetStateAction } from 'react';

export interface FormData {
  userType: 'personal' | 'company';
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminSecretKey?: string;
  // Personal user fields
  cin?: string;
  personalAddress?: string;
  personalPhone?: string;
  // Company fields
  companyName?: string;
  companyIRC?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  companyWebsite?: string;
}

export interface StepValidation {
  isLoading: boolean;
  errors: Record<string, string>;
}

export type SetStepValidation = Dispatch<SetStateAction<StepValidation>>;

export interface MultiStepFormContextType {
  currentStep: number;
  formData: FormData;
  stepValidation: StepValidation;
  nextStep: () => void;
  prevStep: () => void;
  setCurrentStep: (step: number) => void;
  setFormData: (data: Partial<FormData>) => void;
  validateUsername: () => Promise<boolean>;
  validateEmail: () => Promise<boolean>;
  registerUser: () => Promise<boolean>;
  verifyEmail: (code: string) => Promise<boolean>;
  resetForm: () => void;
}

export const initialFormData: FormData = {
  userType: 'personal',
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  adminSecretKey: '',
  // Personal user fields
  cin: '',
  personalAddress: '',
  personalPhone: '',
  // Company fields
  companyName: '',
  companyIRC: '',
  companyAddress: '',
  companyPhone: '',
  companyEmail: '',
  companyWebsite: '',
};
