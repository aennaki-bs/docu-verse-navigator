
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
                ? 'bg-blue-600 text-white'
                : step < currentStep
                ? 'bg-blue-900/30 text-blue-400 border border-blue-500'
                : 'bg-gray-800 text-gray-500 border border-gray-700'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < 3 && (
            <div
              className={`h-1 w-10 ${
                step < currentStep ? 'bg-blue-600' : 'bg-gray-700'
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
    <h3 className="text-xl font-semibold text-white">{titles[currentStep - 1]}</h3>
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
    <div className="min-h-screen flex">
      {/* Left side - Registration form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0d1117]">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <DocuVerseLogo className="mx-auto h-14 w-auto" />
            <h2 className="mt-6 text-3xl font-bold text-white">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Join DocuVerse to manage your documents
            </p>
          </div>
          
          <Card className="border-gray-800 bg-[#161b22] shadow-xl">
            <CardHeader className="space-y-1 pb-2 border-b border-gray-800">
              <StepIndicator currentStep={currentStep} />
              <StepTitle currentStep={currentStep} />
            </CardHeader>
            
            <CardContent className="pt-6">
              {renderStep()}
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-0 border-t border-gray-800">
              <div className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-400 hover:text-blue-300"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Right side - Image and text */}
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-[#0d1117] to-[#161b22] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ 
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%232d3748' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E')"
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12">
          <div className="text-center max-w-lg">
            <h1 className="text-4xl font-bold text-white mb-4">
              Join Our Business Platform
            </h1>
            <p className="text-lg text-gray-300">
              Create your account to access all features and start managing your business
            </p>
            
            <div className="mt-12 space-y-6">
              <div className="flex items-center space-x-3 bg-[#1c2128]/50 p-3 rounded-lg border border-blue-900/30">
                <div className="bg-green-500/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-medium">Easy Registration</h3>
                  <p className="text-sm text-gray-400">Quick 3-step registration process</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-[#1c2128]/50 p-3 rounded-lg border border-blue-900/30">
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-medium">Secure Account</h3>
                  <p className="text-sm text-gray-400">Your data is protected with enterprise-level security</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 bg-[#1c2128]/50 p-3 rounded-lg border border-blue-900/30">
                <div className="bg-purple-500/20 p-2 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-white font-medium">Instant Access</h3>
                  <p className="text-sm text-gray-400">Get started immediately after registration</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
