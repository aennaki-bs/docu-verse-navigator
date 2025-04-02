
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import StepOneUserInfo from '@/components/register/StepOneUserInfo';
import StepTwoEmailPassword from '@/components/register/StepTwoEmailPassword';
import StepThreeAdminKey from '@/components/register/StepThreeAdminKey';
import { MultiStepFormProvider, useMultiStepForm } from '@/context/MultiStepFormContext';

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              step === currentStep
                ? 'bg-docuBlue text-white'
                : step < currentStep
                ? 'bg-docuBlue-100 text-docuBlue border border-docuBlue'
                : 'bg-gray-100 text-gray-400 border border-gray-300'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < 3 && (
            <div
              className={`h-1 w-10 ${
                step < currentStep ? 'bg-docuBlue' : 'bg-gray-200'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

// Step title component
const StepTitle = ({ currentStep }: { currentStep: number }) => {
  const titles = [
    'User Information',
    'Account Credentials',
    'Admin Access (Optional)'
  ];

  return (
    <h3 className="text-xl font-semibold">{titles[currentStep - 1]}</h3>
  );
};

const RegisterForm = () => {
  const { currentStep } = useMultiStepForm();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOneUserInfo />;
      case 2:
        return <StepTwoEmailPassword />;
      case 3:
        return <StepThreeAdminKey />;
      default:
        return <StepOneUserInfo />;
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <DocuVerseLogo className="mx-auto h-14 w-auto" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Join DocuVerse to manage your documents
          </p>
        </div>
        
        <Card className="border-none shadow-xl animate-slide-up">
          <CardHeader className="space-y-1 pb-2">
            <StepIndicator currentStep={currentStep} />
            <StepTitle currentStep={currentStep} />
          </CardHeader>
          
          <CardContent>
            {renderStep()}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-primary hover:text-primary/90"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// Wrapper component with MultiStepFormProvider
const Register = () => {
  return (
    <MultiStepFormProvider>
      <RegisterForm />
    </MultiStepFormProvider>
  );
};

export default Register;
