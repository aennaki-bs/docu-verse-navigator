
import React from 'react';
import { useMultiStepForm } from '@/context/MultiStepFormContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { toast } from 'sonner';

const StepOneUserInfo = () => {
  const { formData, setFormData, validateUsername, nextStep, stepValidation } = useMultiStepForm();
  const [localErrors, setLocalErrors] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const validateStep = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      errors.firstName = 'First name must be at least 2 characters';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      errors.lastName = 'Last name must be at least 2 characters';
    }
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      errors.username = 'Username can only contain letters, numbers, and underscores';
    }
    
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep()) {
      toast.error("Please correct all errors before proceeding");
      return;
    }
    
    // Validate username with API
    const isValid = await validateUsername();
    if (isValid) {
      nextStep();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="firstName">First Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="firstName"
            name="firstName"
            placeholder="First Name"
            className={`pl-10 ${localErrors.firstName ? 'border-red-500' : ''}`}
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        {localErrors.firstName && (
          <p className="text-sm text-red-500">{localErrors.firstName}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="lastName">Last Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            className={`pl-10 ${localErrors.lastName ? 'border-red-500' : ''}`}
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        {localErrors.lastName && (
          <p className="text-sm text-red-500">{localErrors.lastName}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label htmlFor="username">Username</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="username"
            name="username"
            placeholder="Username"
            className={`pl-10 ${
              localErrors.username || stepValidation.errors.username ? 'border-red-500' : ''
            }`}
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        {localErrors.username && (
          <p className="text-sm text-red-500">{localErrors.username}</p>
        )}
        {stepValidation.errors.username && (
          <p className="text-sm text-red-500">{stepValidation.errors.username}</p>
        )}
      </div>

      <Button
        type="button"
        className="w-full bg-docuBlue hover:bg-docuBlue-700"
        onClick={handleNext}
        disabled={stepValidation.isLoading}
      >
        {stepValidation.isLoading ? 'Checking...' : 'Next'}
      </Button>
    </div>
  );
};

export default StepOneUserInfo;
