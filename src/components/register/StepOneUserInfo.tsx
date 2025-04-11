
import React, { useState } from 'react';
import { useMultiStepForm } from '@/context/form';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import UserTypeSelector from './UserTypeSelector';
import PersonalUserFields from './personal/PersonalUserFields';
import CompanyUserFields from './company/CompanyUserFields';
import { validatePersonalUserInfo, validateCompanyInfo } from './utils/validation';

const StepOneUserInfo = () => {
  const { formData, setFormData, nextStep } = useMultiStepForm();
  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleUserTypeChange = (value: 'personal' | 'company') => {
    setFormData({ userType: value });
    // Clear errors when changing user type
    setLocalErrors({});
  };

  const validateStep = () => {
    let errors: Record<string, string> = {};
    
    if (formData.userType === 'personal') {
      errors = validatePersonalUserInfo(formData);
    } else {
      errors = validateCompanyInfo(formData);
    }
    
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) {
      toast.error("Please correct all errors before proceeding");
      return;
    }
    
    nextStep();
  };

  return (
    <div className="space-y-5">
      {/* User Type Selection */}
      <UserTypeSelector 
        userType={formData.userType} 
        onChange={handleUserTypeChange} 
      />
      
      <div className="max-h-[350px] overflow-y-auto pr-1 py-1">
        {/* Personal User Fields */}
        {formData.userType === 'personal' && (
          <PersonalUserFields
            formData={formData}
            localErrors={localErrors}
            handleChange={handleChange}
          />
        )}
        
        {/* Company Fields */}
        {formData.userType === 'company' && (
          <CompanyUserFields
            formData={formData}
            localErrors={localErrors}
            handleChange={handleChange}
          />
        )}
      </div>

      <div className="pt-2">
        <Button
          type="button"
          className="w-full bg-docuBlue hover:bg-docuBlue-700"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StepOneUserInfo;
