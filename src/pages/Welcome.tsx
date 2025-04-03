
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import DocuVerseLogo from '@/components/DocuVerseLogo';

const Welcome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const verified = location.state?.verified || false;
  const userEmail = location.state?.email || '';

  useEffect(() => {
    // Show success toast when the page loads
    if (verified) {
      toast.success('Registration completed successfully!', {
        description: 'Welcome to DocuVerse!',
      });
    }
  }, [verified]);

  const handleContinue = () => {
    navigate('/login', { replace: true });
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <DocuVerseLogo className="mx-auto h-14 w-auto" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to DocuVerse
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {userEmail ? `You've successfully registered with ${userEmail}` : 'You\'ve successfully registered'}
          </p>
        </div>

        <Card className="border-none shadow-xl animate-slide-up">
          <CardHeader className="space-y-1">
            <div className="mx-auto bg-green-100 rounded-full p-3 w-16 h-16 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-center mt-4">
              Registration Complete
            </CardTitle>
            <CardDescription className="text-center">
              Your account has been verified and is ready to use
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-center text-sm">
                Thank you for joining DocuVerse! You can now sign in to your account and start 
                managing your documents securely.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              className="w-full bg-docuBlue hover:bg-docuBlue-700"
              onClick={handleContinue}
            >
              Continue to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Welcome;
