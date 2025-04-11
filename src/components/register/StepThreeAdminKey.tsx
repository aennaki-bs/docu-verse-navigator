
import React, { useState } from 'react';
import { useMultiStepForm } from '@/context/MultiStepFormContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronLeft, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const StepThreeAdminKey = () => {
  const { formData, setFormData, prevStep, nextStep } = useMultiStepForm();
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const validateStep = () => {
    // Admin key is optional, so there's no validation requirement
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast.error("Please correct all errors before proceeding");
      return;
    }
    
    // Go to review step instead of submitting
    nextStep();
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium mb-1">Admin Secret Key (Optional)</h3>
        <p className="text-sm text-gray-500">Provide an admin secret key if you have administrative privileges</p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="adminSecretKey">Secret Key</Label>
          <Input
            id="adminSecretKey"
            name="adminSecretKey"
            type="password"
            placeholder="Enter admin secret key"
            value={formData.adminSecretKey}
            onChange={handleChange}
            className="bg-black/5"
          />
          <p className="text-xs text-gray-500">
            Leave this field empty if you don't have an admin secret key.
          </p>
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          className="flex-1"
          variant="outline"
          onClick={prevStep}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          type="button"
          className="flex-1 bg-docuBlue hover:bg-docuBlue-700"
          onClick={handleNext}
        >
          <span className="flex items-center">
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </Button>
      </div>
    </div>
  );
};

export default StepThreeAdminKey;
