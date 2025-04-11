
import React from 'react';
import { useMultiStepForm } from '@/context/MultiStepFormContext';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { toast } from 'sonner';
import { ChevronLeft, Check, FileEdit } from 'lucide-react';

const StepFourSummary = () => {
  const { 
    formData, 
    prevStep, 
    registerUser, 
    stepValidation, 
    setCurrentStep 
  } = useMultiStepForm();
  
  const handleSubmit = async () => {
    const success = await registerUser();
    if (success) {
      toast.success('Registration successful! Please check your email for verification.');
    }
  };
  
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  return (
    <div className="space-y-5">
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium mb-1">Review Your Information</h3>
        <p className="text-sm text-gray-500">Please verify all information before submitting</p>
      </div>

      {/* Account Type */}
      <Card className="border border-gray-200 bg-gray-50/50">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <div>
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => goToStep(1)}
          >
            <FileEdit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <p className="text-sm capitalize">{formData.userType}</p>
        </CardContent>
      </Card>

      {/* Personal Information */}
      <Card className="border border-gray-200 bg-gray-50/50">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <div>
            <CardTitle className="text-sm font-medium">Personal Information</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => goToStep(1)}
          >
            <FileEdit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="py-2 px-4">
          {formData.userType === 'personal' ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-gray-500">First Name</p>
                <p className="text-sm">{formData.firstName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Name</p>
                <p className="text-sm">{formData.lastName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ID</p>
                <p className="text-sm">{formData.cin || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm">{formData.personalPhone || 'Not provided'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm">{formData.personalAddress || 'Not provided'}</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Company Name</p>
                <p className="text-sm">{formData.companyName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">First Name</p>
                <p className="text-sm">{formData.firstName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Name</p>
                <p className="text-sm">{formData.lastName || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Company IRC</p>
                <p className="text-sm">{formData.companyIRC || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Company Phone</p>
                <p className="text-sm">{formData.companyPhone || 'Not provided'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">Company Address</p>
                <p className="text-sm">{formData.companyAddress || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Company Email</p>
                <p className="text-sm">{formData.companyEmail || 'Not provided'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Company Website</p>
                <p className="text-sm">{formData.companyWebsite || 'Not provided'}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Account Credentials */}
      <Card className="border border-gray-200 bg-gray-50/50">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <div>
            <CardTitle className="text-sm font-medium">Account Credentials</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => goToStep(2)}
          >
            <FileEdit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-gray-500">Username</p>
              <p className="text-sm">{formData.username}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm">{formData.email}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500">Password</p>
              <p className="text-sm">••••••••••</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Admin Access */}
      <Card className="border border-gray-200 bg-gray-50/50">
        <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
          <div>
            <CardTitle className="text-sm font-medium">Admin Access</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => goToStep(3)}
          >
            <FileEdit className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="py-2 px-4">
          <p className="text-sm">
            {formData.adminSecretKey ? 'Admin access key provided' : 'No admin access'}
          </p>
        </CardContent>
      </Card>

      <div className="flex gap-2 pt-4">
        <Button
          type="button"
          className="flex-1"
          variant="outline"
          onClick={prevStep}
          disabled={stepValidation.isLoading}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Button
          type="button"
          className="flex-1 bg-docuBlue hover:bg-docuBlue-700"
          onClick={handleSubmit}
          disabled={stepValidation.isLoading}
        >
          {stepValidation.isLoading ? (
            <span className="flex items-center">Processing...</span>
          ) : (
            <span className="flex items-center">
              Submit
              <Check className="ml-2 h-4 w-4" />
            </span>
          )}
        </Button>
      </div>

      {stepValidation.errors.registration && (
        <p className="text-xs text-red-500 text-center mt-2">
          {stepValidation.errors.registration}
        </p>
      )}
    </div>
  );
};

export default StepFourSummary;
