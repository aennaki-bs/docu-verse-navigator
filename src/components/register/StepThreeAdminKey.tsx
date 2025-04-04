
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiStepForm } from '@/context/MultiStepFormContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { KeyRound } from 'lucide-react';
import { toast } from 'sonner';

const StepThreeAdminKey = () => {
  const { formData, setFormData, registerUser, prevStep, stepValidation } = useMultiStepForm();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [localErrors, setLocalErrors] = React.useState<Record<string, string>>({});
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleToggleAdmin = () => {
    setIsAdmin(!isAdmin);
    if (!isAdmin) {
      setFormData({ adminSecretKey: '' });
    }
  };

  const validateStep = () => {
    const errors: Record<string, string> = {};
    
    if (isAdmin && (!formData.adminSecretKey || formData.adminSecretKey.trim() === '')) {
      errors.adminSecretKey = 'Admin secret key is required';
    }
    
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateStep()) {
      toast.error("Please provide all required information");
      return;
    }
    
    // Register user with or without admin key
    console.log("Submitting registration with email:", formData.email);
    const success = await registerUser();
    
    if (success) {
      console.log("Registration successful, navigating to verification page with email:", formData.email);
      
      // Force a small delay to ensure state is updated
      setTimeout(() => {
        // Make sure email is defined before navigating
        if (formData.email) {
          // Explicitly navigate to the email verification page with the email in state
          navigate('/verify-email', { 
            state: { email: formData.email },
            replace: true
          });
        } else {
          console.error("Email is missing in formData");
          navigate('/verify-email');
        }
      }, 300); // Increased delay further for better state handling
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="isAdmin" checked={isAdmin} onCheckedChange={handleToggleAdmin} />
        <Label htmlFor="isAdmin" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          I am an administrator
        </Label>
      </div>
      
      {isAdmin && (
        <div className="space-y-1">
          <Label htmlFor="adminSecretKey">Admin Secret Key</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="adminSecretKey"
              name="adminSecretKey"
              type="password"
              placeholder="Enter admin secret key"
              className={`pl-10 ${localErrors.adminSecretKey ? 'border-red-500' : ''}`}
              value={formData.adminSecretKey || ''}
              onChange={handleChange}
            />
          </div>
          {localErrors.adminSecretKey && (
            <p className="text-sm text-red-500">{localErrors.adminSecretKey}</p>
          )}
          <p className="text-xs text-gray-500">
            Enter the secret key provided by your organization administrator.
          </p>
        </div>
      )}
      
      {stepValidation.errors.registration && (
        <div className="p-3 bg-red-50 text-red-600 rounded-md">
          {stepValidation.errors.registration}
        </div>
      )}
      
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
          onClick={handleSubmit}
          disabled={stepValidation.isLoading}
        >
          {stepValidation.isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </div>
    </div>
  );
};

export default StepThreeAdminKey;
