
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { toast } from 'sonner';
import authService from '@/services/authService';
import { Alert, AlertDescription } from '@/components/ui/alert';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address to continue');
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      await authService.forgotPassword(email);
      toast.success('A password reset link has been sent to your email.');
      
    } catch (err: any) {
      console.error('Password reset error:', err);
      
      if (err.message?.includes('Email not verified')) {
        toast.info('Your email is not verified. A new verification code has been sent to your inbox.');
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
        return;
      }
      
      // Handle specific error cases with user-friendly messages
      if (err.response) {
        const status = err.response.status;
        const errorMessage = err.response.data;
        
        if (status === 404) {
          setError('No account exists with this email address. Please check your email or create a new account.');
        } else if (status === 401 && errorMessage.includes('Desactivated')) {
          setError('Your account has been deactivated. Please contact support for assistance.');
        } else {
          setError(errorMessage || 'An unexpected error occurred. Please try again later.');
        }
      } else if (err.request) {
        setError('Unable to reach the server. Please check your internet connection and try again.');
      } else {
        setError('An unexpected error occurred. Please try again later.');
      }
      
      toast.error(error || 'Failed to process your request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <DocuVerseLogo className="mx-auto h-14 w-auto" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Forgot Password
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>
        
        <Card className="border-none shadow-xl animate-slide-up">
          <CardHeader className="space-y-1 pb-2">
            <h3 className="text-xl font-semibold">Reset Password</h3>
          </CardHeader>
          
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    className={`pl-10 ${error ? 'border-red-500' : ''}`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-docuBlue hover:bg-docuBlue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Send Reset Link'}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{' '}
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

export default ForgotPassword;
