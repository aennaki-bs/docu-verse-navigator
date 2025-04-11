
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import StepOneUserInfo from '@/components/register/StepOneUserInfo';
import StepTwoEmailPassword from '@/components/register/StepTwoEmailPassword';
import StepThreeAdminKey from '@/components/register/StepThreeAdminKey';
import StepFourSummary from '@/components/register/StepFourSummary';
import { MultiStepFormProvider, useMultiStepForm } from '@/context/form';

// Step indicator component
const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex justify-center mb-6">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
              step === currentStep
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : step < currentStep
                ? 'bg-blue-900/30 text-blue-400 border border-blue-500'
                : 'bg-gray-800 text-gray-500 border border-gray-700'
            }`}
          >
            {step < currentStep ? '✓' : step}
          </div>
          {step < 4 && (
            <div
              className={`h-1.5 w-16 rounded-full transition-all ${
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
    'Account Details',
    'Credentials',
    'Admin Access (Optional)',
    'Review Information'
  ];

  return (
    <h3 className="text-xl font-semibold text-white">{titles[currentStep - 1]}</h3>
  );
};

// Helper component for right side content based on current step
const RightSideContent = ({ currentStep }: { currentStep: number }) => {
  // Different content for each step
  if (currentStep === 1) {
    return (
      <>
        <h1 className="text-4xl font-bold text-white mb-6">
          Join Our Business Platform
        </h1>
        <p className="text-lg text-gray-300 mb-10">
          Create your account to access all features and start managing your business
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4 bg-[#1c2128]/50 p-4 rounded-lg border border-blue-900/30">
            <div className="bg-green-500/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Select Account Type</h3>
              <p className="text-sm text-gray-400">Choose between personal or company account</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-[#1c2128]/50 p-4 rounded-lg border border-blue-900/30">
            <div className="bg-blue-500/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Provide Your Details</h3>
              <p className="text-sm text-gray-400">Enter contact and identification information</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 bg-[#1c2128]/50 p-4 rounded-lg border border-blue-900/30">
            <div className="bg-purple-500/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Complete Profile</h3>
              <p className="text-sm text-gray-400">Fill in all necessary information to get started</p>
            </div>
          </div>
        </div>
      </>
    );
  } else if (currentStep === 2) {
    return (
      <>
        <h1 className="text-4xl font-bold text-white mb-4">
          Set Up Your Account Credentials
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Create unique credentials that will be used to access your account
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-3 bg-[#1c2128]/50 p-3 rounded-lg border border-blue-900/30">
            <div className="bg-green-500/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Unique Username</h3>
              <p className="text-sm text-gray-400">Choose a unique username that identifies you on the platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-[#1c2128]/50 p-3 rounded-lg border border-blue-900/30">
            <div className="bg-blue-500/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Verified Email</h3>
              <p className="text-sm text-gray-400">Enter a valid email address for account verification</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-[#1c2128]/50 p-3 rounded-lg border border-blue-900/30">
            <div className="bg-purple-500/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Secure Password</h3>
              <p className="text-sm text-gray-400">Create a strong password to protect your account</p>
            </div>
          </div>
        </div>
      </>
    );
  } else if (currentStep === 3) {
    return (
      <>
        <h1 className="text-4xl font-bold text-white mb-4">
          Almost There!
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Complete the final step to activate your account
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-3 bg-[#1c2128]/50 p-3 rounded-lg border border-blue-900/30">
            <div className="bg-green-500/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Admin Access</h3>
              <p className="text-sm text-gray-400">Optional: Enter admin key if you have administrative privileges</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-[#1c2128]/50 p-3 rounded-lg border border-blue-900/30">
            <div className="bg-blue-500/20 p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
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
      </>
    );
  } else if (currentStep === 4) {
    return (
      <>
        <h1 className="text-4xl font-bold text-white mb-4">
          Review Your Information
        </h1>
        <p className="text-lg text-gray-300 mb-8">
          Please verify all details before completing registration
        </p>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-3 bg-[#1c2128]/70 p-4 rounded-lg border border-blue-900/40 backdrop-blur-sm">
            <div className="bg-green-500/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Verify Account Details</h3>
              <p className="text-sm text-gray-400">Confirm your personal information and contact details</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-[#1c2128]/70 p-4 rounded-lg border border-blue-900/40 backdrop-blur-sm">
            <div className="bg-blue-500/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Secure Access Information</h3>
              <p className="text-sm text-gray-400">Check your username, email, and password</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 bg-[#1c2128]/70 p-4 rounded-lg border border-blue-900/40 backdrop-blur-sm">
            <div className="bg-purple-500/20 p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="text-white font-medium">Complete Registration</h3>
              <p className="text-sm text-gray-400">Submit your registration when all information is verified</p>
            </div>
          </div>
        </div>
      </>
    );
  }
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
      case 4:
        return <StepFourSummary />;
      default:
        return <StepOneUserInfo />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left side - Registration form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-0 bg-[#0d1117] h-screen">
        <div className="w-full max-w-2xl py-6 px-4">
          <div className="text-center mb-8">
            <DocuVerseLogo className="mx-auto h-14 w-auto" />
            <h2 className="mt-4 text-3xl font-bold text-white">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Join DocuVerse to manage your documents
            </p>
          </div>
          
          <Card className="border-gray-800 bg-gradient-to-b from-[#161b22] to-[#0d1117] shadow-2xl">
            <CardHeader className="space-y-1 pb-2 px-8 pt-6 border-b border-gray-800">
              <StepIndicator currentStep={currentStep} />
              <StepTitle currentStep={currentStep} />
            </CardHeader>
            
            <ScrollArea className="h-[56vh]">
              <CardContent className="pt-8 px-8">
                {renderStep()}
              </CardContent>
            </ScrollArea>
            
            <CardFooter className="flex flex-col space-y-4 pt-6 pb-6 px-8 border-t border-gray-800">
              <div className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      {/* Right side - Image and text */}
      <div className="hidden md:block md:w-1/2 bg-gradient-to-r from-[#0d1117] to-[#161b22] relative">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ 
            backgroundImage: "url('data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%232d3748' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E')"
          }}
        ></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center p-16">
          <div className="text-center max-w-xl">
            <RightSideContent currentStep={currentStep} />
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
