
import React, { useState } from 'react';
import { useMultiStepForm } from '@/context/MultiStepFormContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import UsernameField from './fields/UsernameField';
import EmailField from './fields/EmailField';
import PasswordFields from './fields/PasswordFields';
import { calculatePasswordStrength } from './utils/passwordUtils';

const StepTwoEmailPassword = () => {
  const { formData, setFormData, validateEmail, validateUsername, nextStep, prevStep, stepValidation } = useMultiStepForm();
  const [localErrors, setLocalErrors] = React.useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }
  };

  const validateStep = () => {
    const errors: Record<string, string> = {};
    
    // Username validation
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (passwordStrength < 5) {
      errors.password = 'Password is not strong enough. Please include uppercase, lowercase, numbers, and special characters.';
    }
    
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      if (localErrors.password && passwordStrength < 5) {
        toast.error("Please create a stronger password before proceeding");
      }
      return;
    }
    
    // Validate username and email with API
    const isUsernameValid = await validateUsername();
    if (!isUsernameValid) return;
    
    const isEmailValid = await validateEmail();
    if (isEmailValid) {
      nextStep();
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Username field */}
        <div className="col-span-1">
          <UsernameField 
            value={formData.username} 
            onChange={handleChange} 
            localErrors={localErrors} 
            validationErrors={stepValidation.errors} 
          />
        </div>
        
        {/* Email field */}
        <div className="col-span-1">
          <EmailField 
            value={formData.email} 
            onChange={handleChange} 
            localErrors={localErrors} 
            validationErrors={stepValidation.errors} 
          />
        </div>
      </div>
      
      {/* Password fields */}
      <PasswordFields 
        password={formData.password}
        confirmPassword={formData.confirmPassword}
        passwordStrength={passwordStrength}
        onChange={handleChange}
        localErrors={localErrors}
      />
      
      <div className="flex space-x-2 pt-2">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={prevStep}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1 bg-docuBlue hover:bg-docuBlue-700"
          onClick={handleNext}
          disabled={stepValidation.isLoading}
        >
          {stepValidation.isLoading ? 'Checking...' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default StepTwoEmailPassword;
