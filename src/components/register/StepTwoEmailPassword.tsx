
import React, { useState } from 'react';
import { useMultiStepForm } from '@/context/MultiStepFormContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner';

const StepTwoEmailPassword = () => {
  const { formData, setFormData, validateEmail, nextStep, prevStep, stepValidation } = useMultiStepForm();
  const [showPassword, setShowPassword] = useState(false);
  const [localErrors, setLocalErrors] = React.useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  };

  const getStrengthLabel = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 4) return 'Medium';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-200';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const validateStep = () => {
    const errors: Record<string, string> = {};
    
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
    
    // Validate email with API
    const isValid = await validateEmail();
    if (isValid) {
      nextStep();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            className={`pl-10 ${
              localErrors.email || stepValidation.errors.email ? 'border-red-500' : ''
            }`}
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {localErrors.email && (
          <p className="text-sm text-red-500">{localErrors.email}</p>
        )}
        {stepValidation.errors.email && (
          <p className="text-sm text-red-500">{stepValidation.errors.email}</p>
        )}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={`pl-10 ${localErrors.password ? 'border-red-500' : ''}`}
            value={formData.password}
            onChange={handleChange}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {localErrors.password && (
          <p className="text-sm text-red-500">{localErrors.password}</p>
        )}
        
        {/* Password strength meter */}
        {formData.password && (
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full transition-all ${getStrengthColor()}`}
                style={{ width: `${passwordStrength * 20}%` }}
              ></div>
            </div>
            <p className="text-xs mt-1">
              Strength: <span className="font-medium">{getStrengthLabel()}</span>
              {passwordStrength < 5 && (
                <span className="text-red-500 ml-1">
                  (Must be Strong to continue)
                </span>
              )}
            </p>
            {passwordStrength < 5 && (
              <ul className="text-xs mt-1 text-gray-600 list-disc pl-4">
                <li className={formData.password.length >= 8 ? "text-green-500" : ""}>At least 8 characters</li>
                <li className={/[A-Z]/.test(formData.password) ? "text-green-500" : ""}>At least one uppercase letter</li>
                <li className={/[a-z]/.test(formData.password) ? "text-green-500" : ""}>At least one lowercase letter</li>
                <li className={/[0-9]/.test(formData.password) ? "text-green-500" : ""}>At least one number</li>
                <li className={/[^A-Za-z0-9]/.test(formData.password) ? "text-green-500" : ""}>At least one special character</li>
              </ul>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={`pl-10 ${localErrors.confirmPassword ? 'border-red-500' : ''}`}
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>
        {localErrors.confirmPassword && (
          <p className="text-sm text-red-500">{localErrors.confirmPassword}</p>
        )}
      </div>
      
      <div className="flex space-x-2">
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
