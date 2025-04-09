
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  InputOTP, 
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator 
} from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Check, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import authService from '@/services/authService';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { Link } from 'react-router-dom';

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
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117] p-4">
        <div className="text-center">
          <DocuVerseLogo className="mx-auto h-14 w-auto" />
          <p className="mt-4 text-gray-400">Redirecting to registration page...</p>
          <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117] p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <DocuVerseLogo className="mx-auto h-14 w-auto" />
          <h2 className="mt-6 text-3xl font-bold text-white">
            Verify Your Email
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            We've sent a 6-digit verification code to <span className="font-medium text-gray-300">{email}</span>
          </p>
        </div>
        
        <Card className="border-gray-800 bg-[#161b22] shadow-xl p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Mail className="h-5 w-5 text-blue-400" />
              <h3 className="text-xl font-semibold text-white">Email Verification</h3>
            </div>
            
            <p className="text-center text-gray-400 text-sm">
              Enter the verification code to complete your registration
            </p>
            
            <div className="flex justify-center my-8">
              <InputOTP 
                maxLength={6}
                value={verificationCode}
                onChange={setVerificationCode}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot 
                    index={0} 
                    className="border-gray-700 bg-[#0d1117] text-white"
                  />
                  <InputOTPSlot 
                    index={1} 
                    className="border-gray-700 bg-[#0d1117] text-white"
                  />
                  <InputOTPSlot 
                    index={2} 
                    className="border-gray-700 bg-[#0d1117] text-white"
                  />
                  <InputOTPSlot 
                    index={3} 
                    className="border-gray-700 bg-[#0d1117] text-white"
                  />
                  <InputOTPSlot 
                    index={4} 
                    className="border-gray-700 bg-[#0d1117] text-white"
                  />
                  <InputOTPSlot 
                    index={5} 
                    className="border-gray-700 bg-[#0d1117] text-white"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            {error && (
              <div className="p-3 bg-red-900/30 text-red-200 rounded-md text-sm flex items-center border border-red-800">
                <AlertCircle className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 relative overflow-hidden group"
                onClick={handleVerify}
                disabled={isLoading}
              >
                <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                  {!isLoading && <Check className="h-4 w-4" />}
                </span>
              </Button>
              
              <Button
                variant="outline"
                className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                onClick={handleResendCode}
                disabled={isLoading || resendDisabled}
              >
                <span className="flex items-center justify-center gap-2">
                  {resendDisabled 
                    ? `Resend Code (${countdown}s)` 
                    : 'Resend Code'}
                  <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </span>
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-800 mt-4">
              <ArrowLeft size={16} className="text-gray-400" />
              <Link to="/login" className="text-blue-400 hover:text-blue-300 text-sm">
                Back to login
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmailVerification;
