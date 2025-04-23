
import React from 'react';
import { useMultiStepForm } from '@/context/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const StepFiveSummary: React.FC = () => {
  const { formData, prevStep, registerUser, stepValidation } = useMultiStepForm();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await registerUser();
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get user details based on user type
  const getUserDetails = () => {
    if (formData.userType === 'personal') {
      return [
        { label: 'First Name', value: formData.firstName },
        { label: 'Last Name', value: formData.lastName },
        { label: 'CIN', value: formData.cin || 'Not provided' },
        { label: 'Address', value: formData.personalAddress || 'Not provided' },
        { label: 'City', value: formData.city || 'Not provided' },
        { label: 'Country', value: formData.country || 'Not provided' },
        { label: 'Phone', value: formData.personalPhone || 'Not provided' },
      ];
    } else {
      return [
        { label: 'Company Name', value: formData.companyName },
        { label: 'Company IRC', value: formData.companyIRC || 'Not provided' },
        { label: 'Company Address', value: formData.companyAddress || 'Not provided' },
        { label: 'Company Phone', value: formData.companyPhone || 'Not provided' },
        { label: 'Company Email', value: formData.companyEmail || 'Not provided' },
        { label: 'Company Website', value: formData.companyWebsite || 'Not provided' },
      ];
    }
  };

  const accountDetails = [
    { label: 'Username', value: formData.username },
    { label: 'Email', value: formData.email },
    { label: 'Admin Access', value: formData.adminSecretKey ? 'Yes' : 'No' },
  ];

  return (
    <div className="space-y-6">
      {/* Error display */}
      {stepValidation.errors.registration && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-5 w-5" />
          <AlertDescription className="ml-2">
            {stepValidation.errors.registration}
          </AlertDescription>
        </Alert>
      )}

      <div className="text-center mb-6">
        <div className="bg-blue-600/20 p-3 rounded-full inline-flex mb-3">
          <CheckCircle2 className="h-6 w-6 text-blue-400" />
        </div>
        <h3 className="text-xl font-medium mb-2">Review Your Information</h3>
        <p className="text-sm text-gray-500">
          Please verify all information before submitting
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-800/40 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Account Credentials</h4>
          <div className="space-y-2">
            {accountDetails.map((detail, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-gray-400">{detail.label}</span>
                <span className="text-sm">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/40 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-300 mb-3">
            {formData.userType === 'personal' ? 'Personal Details' : 'Company Details'}
          </h4>
          <div className="space-y-2">
            {getUserDetails().map((detail, index) => (
              <div key={index} className="flex justify-between">
                <span className="text-sm text-gray-400">{detail.label}</span>
                <span className="text-sm">{detail.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <Button
          type="button"
          className="flex-1"
          variant="outline"
          onClick={prevStep}
          disabled={isSubmitting || stepValidation.isLoading}
        >
          Back
        </Button>
        <Button
          type="button"
          className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0"
          onClick={handleSubmit}
          disabled={isSubmitting || stepValidation.isLoading}
        >
          {isSubmitting || stepValidation.isLoading ? 'Registering...' : 'Complete Registration'}
        </Button>
      </div>
    </div>
  );
};

export default StepFiveSummary;
