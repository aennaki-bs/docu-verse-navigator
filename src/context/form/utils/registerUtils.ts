
import authService from '@/services/authService';
import { toast } from 'sonner';
import { FormData, SetStepValidation } from '../types';

export const prepareUserData = (formData: FormData) => {
  // Create the base user data
  const userData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    passwordHash: formData.password,
    confirmPassword: formData.confirmPassword,
    username: formData.username,
    adminSecretKey: formData.adminSecretKey || '',
  };
  
  // Add user type specific data
  if (formData.userType === 'personal') {
    return {
      ...userData,
      userType: 'personal' as const, // Type assertion to narrow the type
      Identity: formData.cin || '',
      Address: formData.personalAddress || '',
      city: formData.city || '',
      country: formData.country || '',
      phoneNumber: formData.personalPhone || '',
    };
  } else {
    return {
      ...userData,
      userType: 'company' as const, // Type assertion to narrow the type
      companyName: formData.companyName || '',
      companyIRC: formData.companyIRC || '',
      companyAddress: formData.companyAddress || '',
      companyPhone: formData.companyPhone || '',
      companyEmail: formData.companyEmail || '',
      companyWebsite: formData.companyWebsite || '',
    };
  }
};

export const registerUser = async (
  formData: FormData,
  setStepValidation: SetStepValidation,
  navigateFunction: (path: string) => void
): Promise<boolean> => {
  // Start loading and clear any previous errors
  setStepValidation((prev) => ({ ...prev, isLoading: true, errors: {} }));
  
  try {
    const userData = prepareUserData(formData);
    console.log("Sending registration data:", userData);
    
    const response = await authService.register(userData);
    console.log("Registration response:", response);
    
    // Clear loading state
    setStepValidation((prev) => ({ ...prev, isLoading: false }));
    
    // Show success message
    toast.success('Registration successful! Please check your email for verification.');
    
    // Redirect to verification page with email
    navigateFunction(`/verify/${formData.email}`);
    
    return true;
  } catch (error: any) {
    console.error('Registration error:', error);
    
    // Extract error message from API response
    let errorMessage = 'Registration failed. Please try again.';
    
    if (error.response) {
      // Server responded with an error
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data && typeof error.response.data.message === 'string') {
        errorMessage = error.response.data.message;
      } else if (error.response.data && typeof error.response.data.error === 'string') {
        errorMessage = error.response.data.error;
      }
    } else if (error.message) {
      // Client-side error with message
      errorMessage = error.message;
    }
    
    // Update step validation with the error message
    setStepValidation((prev) => ({
      ...prev,
      isLoading: false,
      errors: { registration: errorMessage },
    }));
    
    // Display toast error
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
