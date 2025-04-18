
import authService from '@/services/authService';
import { toast } from 'sonner';
import { FormData, SetStepValidation } from '../types';

export const prepareUserData = (formData: FormData) => {
  return {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    passwordHash: formData.password,
    confirmPassword: formData.confirmPassword,
    username: formData.username,
    adminSecretKey: formData.adminSecretKey,
    userType: formData.userType,
    // Include additional fields based on user type
    ...(formData.userType === 'personal' ? {
      cin: formData.cin,
      personalAddress: formData.personalAddress,
      personalPhone: formData.personalPhone,
    } : {
      companyName: formData.companyName,
      companyIRC: formData.companyIRC,
      companyAddress: formData.companyAddress,
      companyPhone: formData.companyPhone,
      companyEmail: formData.companyEmail,
      companyWebsite: formData.companyWebsite,
    })
  };
};

export const registerUser = async (
  formData: FormData,
  setStepValidation: SetStepValidation,
  navigateFunction: (path: string) => void
): Promise<boolean> => {
  setStepValidation((prev) => ({ ...prev, isLoading: true, errors: {} }));
  try {
    const userData = prepareUserData(formData);
    
    await authService.register(userData);
    
    setStepValidation((prev) => ({ ...prev, isLoading: false }));
    toast.success('Registration successful! Please check your email for verification.');
    
    // Redirect to verification page with email
    navigateFunction(`/verify/${formData.email}`);
    
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

export const verifyEmail = async (
  email: string,
  code: string,
  setStepValidation: SetStepValidation,
  navigateFunction: (path: string, state?: any) => void
): Promise<boolean> => {
  setStepValidation((prev) => ({ ...prev, isLoading: true, errors: {} }));
  try {
    const isVerified = await authService.verifyEmail(email, code);
    
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
    
    // Redirect to welcome page after successful verification
    navigateFunction('/welcome', { 
      state: { 
        verified: true,
        email: email
      }
    });
    
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
