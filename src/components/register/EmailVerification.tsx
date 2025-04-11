import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast"
import { useMultiStepForm } from '@/context/form';
import DocuVerseLogo from '@/components/DocuVerseLogo';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const { email } = useParams<{ email?: string }>();
  const navigate = useNavigate();
  const { verifyEmail } = useMultiStepForm();
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Optionally pre-fill email from params if available
    // setFormData({ email: email || '' });
  }, [email]);

  const handleVerifyEmail = async () => {
    setIsLoading(true);
    if (!email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Email is missing. Please ensure you have a valid email in the URL.",
      })
      setIsLoading(false);
      return;
    }

    if (!verificationCode) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter the verification code.",
      })
      setIsLoading(false);
      return;
    }

    try {
      const success = await verifyEmail(verificationCode);
      if (success) {
        toast({
          title: "Success",
          description: "Email verified successfully!",
        })
        navigate('/login'); // Redirect to login page after successful verification
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Email verification failed. Please check the code and try again.",
        })
      }
    } catch (error: any) {
      console.error("Email verification error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred during email verification.",
      })
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <DocuVerseLogo className="mx-auto h-10 w-auto" />
          <CardTitle className="text-2xl font-semibold">Email Verification</CardTitle>
          <CardDescription>Enter the verification code sent to your email.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              placeholder="Enter verification code"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
          <Button onClick={handleVerifyEmail} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Email"}
          </Button>
        </CardContent>
        <div className="text-center mt-4">
          <Link to="/login" className="text-sm text-blue-500 hover:underline">
            Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default EmailVerification;
