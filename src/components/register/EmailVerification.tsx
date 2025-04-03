
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Check, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import authService from '@/services/authService';
import DocuVerseLogo from '@/components/DocuVerseLogo';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  useEffect(() => {
    // If no email is provided, redirect to registration
    if (!email) {
      navigate('/register');
    }
    console.log("Email verification page loaded with email:", email);
  }, [email, navigate]);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter the 6-digit code sent to your email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log("Verifying email with code:", verificationCode);
      await authService.verifyEmail(email, verificationCode);
      
      toast.success('Email verified successfully!');
      
      // Redirect to login page after successful verification
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Verification failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      // Call API to resend verification code
      await authService.validateEmail(email);
      toast.success('Verification code resent to your email');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend verification code';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Show a loading state if email is not yet available
  if (!email) {
    return (
      <div className="auth-container animate-fade-in">
        <div className="w-full max-w-md">
          <div className="text-center">
            <DocuVerseLogo className="mx-auto h-14 w-auto" />
            <p>Redirecting...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <DocuVerseLogo className="mx-auto h-14 w-auto" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            We've sent a 6-digit verification code to {email}
          </p>
        </div>
        
        <Card className="border-none shadow-xl animate-slide-up">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-semibold flex items-center">
              <Mail className="mr-2 h-5 w-5" /> Email Verification
            </CardTitle>
            <CardDescription>
              Enter the verification code to complete your registration
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={verificationCode}
                onChange={(value) => {
                  setVerificationCode(value);
                  setError('');
                }}
                render={({ slots }) => (
                  <InputOTPGroup className="gap-2">
                    {slots.map((slot, index) => (
                      <InputOTPSlot key={index} {...slot} index={index} />
                    ))}
                  </InputOTPGroup>
                )}
              />
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
                {error}
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full bg-docuBlue hover:bg-docuBlue-700"
              onClick={handleVerify}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
              {!isLoading && <Check className="ml-2 h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              className="w-full"
              onClick={handleResendCode}
              disabled={isLoading}
            >
              Resend Code
              <RefreshCw className="ml-2 h-4 w-4" />
            </Button>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already verified? <a href="/login" className="font-medium text-primary hover:text-primary/90">Sign in</a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
