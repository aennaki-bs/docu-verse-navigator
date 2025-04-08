
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  InputOTP, 
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator 
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Check, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import authService from '@/services/authService';
import DocuVerseLogo from '@/components/DocuVerseLogo';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  
  // Extract email from state, URL params, or path
  const path = window.location.pathname;
  const emailFromPath = path.startsWith('/verify/') ? path.substring(8) : '';
  const emailFromParams = params.email || '';
  
  // Get email from various possible sources with priority
  const email = location.state?.email || 
                emailFromParams ||
                emailFromPath || 
                '';
  
  // Debug logs to track state
  console.log("EmailVerification component rendering");
  console.log("Email from location state:", location.state?.email);
  console.log("Email from params:", emailFromParams);
  console.log("Email from path:", emailFromPath);
  console.log("Final email being used:", email);

  useEffect(() => {
    // If no email is provided, redirect to registration
    if (!email) {
      console.warn("No email found in state or URL, redirecting to registration");
      navigate('/register');
    } else {
      console.log("Email verification page loaded with email:", email);
    }
  }, [email, navigate]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleVerify = async () => {
    if (verificationCode.length !== 6) {
      setError('Please enter the 6-digit code sent to your email');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log("Verifying email with code:", verificationCode, "for email:", email);
      await authService.verifyEmail(email, verificationCode);
      
      toast.success('Email verified successfully!');
      
      // Redirect to welcome page after successful verification
      setTimeout(() => {
        navigate('/welcome', { 
          state: { 
            verified: true,
            email: email 
          },
          replace: true
        });
      }, 2000);
    } catch (error: any) {
      // Get detailed error message from error response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data || 
                          'Verification failed. Please try again.';
      
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Email verification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      toast.error('Email address is missing. Please go back to registration.');
      return;
    }

    setIsLoading(true);
    setResendDisabled(true);
    setCountdown(60); // 60 seconds cooldown before next resend
    
    try {
      // Call API to resend verification code
      console.log("Resending verification code to:", email);
      await authService.resendVerificationCode(email);
      toast.success('Verification code resent to your email');
    } catch (error: any) {
      // Get detailed error message from error response
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.response?.data || 
                          'Failed to resend verification code';
      
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Resend code error:", error);
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
            <p>Redirecting to registration page...</p>
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
            We've sent a 6-digit verification code to <span className="font-medium">{email}</span>
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
                onChange={setVerificationCode}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
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
              disabled={isLoading || resendDisabled}
            >
              {resendDisabled 
                ? `Resend Code (${countdown}s)` 
                : 'Resend Code'}
              <RefreshCw className={`ml-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
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
