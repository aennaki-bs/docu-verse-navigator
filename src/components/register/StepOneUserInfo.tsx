
import React from 'react';
import { useMultiStepForm } from '@/context/MultiStepFormContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Building2, User, Briefcase, Phone, MapPin, Globe, Mail, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const StepOneUserInfo = () => {
  const { formData, setFormData, nextStep } = useMultiStepForm();
  const [localErrors, setLocalErrors] = React.useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ [name]: value });
  };

  const handleUserTypeChange = (value: 'personal' | 'company') => {
    setFormData({ userType: value });
  };

  const validateStep = () => {
    const errors: Record<string, string> = {};
    
    if (formData.userType === 'personal') {
      // Personal user validation
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
      
      if (!formData.cin?.trim()) {
        errors.cin = 'CIN is required';
      }
      
      if (!formData.personalAddress?.trim()) {
        errors.personalAddress = 'Address is required';
      }
      
      if (!formData.personalPhone?.trim()) {
        errors.personalPhone = 'Phone number is required';
      }
    } else {
      // Company validation
      if (!formData.companyName?.trim()) {
        errors.companyName = 'Company name is required';
      }
      
      if (!formData.companyIRC?.trim()) {
        errors.companyIRC = 'Company IRC is required';
      }
      
      if (!formData.companyAddress?.trim()) {
        errors.companyAddress = 'Company address is required';
      }
      
      if (!formData.companyPhone?.trim()) {
        errors.companyPhone = 'Company phone is required';
      }
      
      if (formData.companyEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.companyEmail)) {
        errors.companyEmail = 'Please enter a valid email address';
      }
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
    <div className="space-y-6">
      {/* User Type Selection */}
      <div className="space-y-2">
        <Label>Account Type</Label>
        <RadioGroup 
          value={formData.userType}
          onValueChange={(value) => handleUserTypeChange(value as 'personal' | 'company')}
          className="grid grid-cols-2 gap-4"
        >
          <div className={`flex flex-col items-center justify-between rounded-md border p-4 ${formData.userType === 'personal' ? 'border-blue-600 bg-blue-600/10' : 'border-gray-700 hover:border-blue-600/50'}`}>
            <RadioGroupItem value="personal" id="personal" className="sr-only" />
            <User className="h-6 w-6 mb-2" />
            <Label htmlFor="personal" className="cursor-pointer font-medium">Personal</Label>
          </div>
          
          <div className={`flex flex-col items-center justify-between rounded-md border p-4 ${formData.userType === 'company' ? 'border-blue-600 bg-blue-600/10' : 'border-gray-700 hover:border-blue-600/50'}`}>
            <RadioGroupItem value="company" id="company" className="sr-only" />
            <Building2 className="h-6 w-6 mb-2" />
            <Label htmlFor="company" className="cursor-pointer font-medium">Company</Label>
          </div>
        </RadioGroup>
      </div>
      
      {/* Personal User Fields */}
      {formData.userType === 'personal' && (
        <>
          {/* First Name */}
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
          
          {/* Last Name */}
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
          
          {/* CIN */}
          <div className="space-y-1">
            <Label htmlFor="cin">CIN (ID Number)</Label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="cin"
                name="cin"
                placeholder="National ID Number"
                className={`pl-10 ${localErrors.cin ? 'border-red-500' : ''}`}
                value={formData.cin || ''}
                onChange={handleChange}
              />
            </div>
            {localErrors.cin && (
              <p className="text-sm text-red-500">{localErrors.cin}</p>
            )}
          </div>
          
          {/* Personal Address */}
          <div className="space-y-1">
            <Label htmlFor="personalAddress">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="personalAddress"
                name="personalAddress"
                placeholder="Your Address"
                className={`pl-10 ${localErrors.personalAddress ? 'border-red-500' : ''}`}
                value={formData.personalAddress || ''}
                onChange={handleChange}
              />
            </div>
            {localErrors.personalAddress && (
              <p className="text-sm text-red-500">{localErrors.personalAddress}</p>
            )}
          </div>
          
          {/* Phone Number */}
          <div className="space-y-1">
            <Label htmlFor="personalPhone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="personalPhone"
                name="personalPhone"
                placeholder="Your Phone Number"
                className={`pl-10 ${localErrors.personalPhone ? 'border-red-500' : ''}`}
                value={formData.personalPhone || ''}
                onChange={handleChange}
              />
            </div>
            {localErrors.personalPhone && (
              <p className="text-sm text-red-500">{localErrors.personalPhone}</p>
            )}
          </div>
        </>
      )}
      
      {/* Company Fields */}
      {formData.userType === 'company' && (
        <>
          {/* Company Name */}
          <div className="space-y-1">
            <Label htmlFor="companyName">Company Name</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="companyName"
                name="companyName"
                placeholder="Company Name"
                className={`pl-10 ${localErrors.companyName ? 'border-red-500' : ''}`}
                value={formData.companyName || ''}
                onChange={handleChange}
              />
            </div>
            {localErrors.companyName && (
              <p className="text-sm text-red-500">{localErrors.companyName}</p>
            )}
          </div>
          
          {/* Company IRC */}
          <div className="space-y-1">
            <Label htmlFor="companyIRC">Company IRC</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="companyIRC"
                name="companyIRC"
                placeholder="Company Registration Number"
                className={`pl-10 ${localErrors.companyIRC ? 'border-red-500' : ''}`}
                value={formData.companyIRC || ''}
                onChange={handleChange}
              />
            </div>
            {localErrors.companyIRC && (
              <p className="text-sm text-red-500">{localErrors.companyIRC}</p>
            )}
          </div>
          
          {/* Company Address */}
          <div className="space-y-1">
            <Label htmlFor="companyAddress">Company Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="companyAddress"
                name="companyAddress"
                placeholder="Company Address"
                className={`pl-10 ${localErrors.companyAddress ? 'border-red-500' : ''}`}
                value={formData.companyAddress || ''}
                onChange={handleChange}
              />
            </div>
            {localErrors.companyAddress && (
              <p className="text-sm text-red-500">{localErrors.companyAddress}</p>
            )}
          </div>
          
          {/* Company Phone */}
          <div className="space-y-1">
            <Label htmlFor="companyPhone">Company Phone</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="companyPhone"
                name="companyPhone"
                placeholder="Company Phone Number"
                className={`pl-10 ${localErrors.companyPhone ? 'border-red-500' : ''}`}
                value={formData.companyPhone || ''}
                onChange={handleChange}
              />
            </div>
            {localErrors.companyPhone && (
              <p className="text-sm text-red-500">{localErrors.companyPhone}</p>
            )}
          </div>
          
          {/* Company Email */}
          <div className="space-y-1">
            <Label htmlFor="companyEmail">Company Email (Optional)</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="companyEmail"
                name="companyEmail"
                placeholder="Company Email"
                className={`pl-10 ${localErrors.companyEmail ? 'border-red-500' : ''}`}
                value={formData.companyEmail || ''}
                onChange={handleChange}
              />
            </div>
            {localErrors.companyEmail && (
              <p className="text-sm text-red-500">{localErrors.companyEmail}</p>
            )}
          </div>
          
          {/* Company Website */}
          <div className="space-y-1">
            <Label htmlFor="companyWebsite">Company Website (Optional)</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="companyWebsite"
                name="companyWebsite"
                placeholder="Company Website"
                value={formData.companyWebsite || ''}
                onChange={handleChange}
                className="pl-10"
              />
            </div>
          </div>
        </>
      )}

      <Button
        type="button"
        className="w-full bg-docuBlue hover:bg-docuBlue-700"
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  );
};

export default StepOneUserInfo;
