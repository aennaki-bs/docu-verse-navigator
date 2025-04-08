
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, User, WifiOff, ShieldAlert } from 'lucide-react';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { motion } from 'framer-motion';
import { checkApiConnection } from '@/services/api';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ emailOrUsername?: string; password?: string }>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isApiAvailable, setIsApiAvailable] = useState(true);
  const [isCheckingApi, setIsCheckingApi] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check API connection on component mount
  useEffect(() => {
    const checkConnection = async () => {
      setIsCheckingApi(true);
      const isAvailable = await checkApiConnection();
      setIsApiAvailable(isAvailable);
      setIsCheckingApi(false);
      
      if (!isAvailable) {
        setApiError('Cannot connect to server. Please check your network connection or try again later.');
      }
    };
    
    checkConnection();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    const newErrors: { emailOrUsername?: string; password?: string } = {};
    
    if (!emailOrUsername) {
      newErrors.emailOrUsername = 'Login is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRetryConnection = async () => {
    setIsCheckingApi(true);
    setApiError(null);
    
    const isAvailable = await checkApiConnection();
    setIsApiAvailable(isAvailable);
    
    if (!isAvailable) {
      setApiError('Cannot connect to server. Please check your network connection or try again later.');
    } else {
      toast.success('Connection established!');
    }
    
    setIsCheckingApi(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear any previous API errors
    setApiError(null);
    
    if (!validateForm()) return;

    // Check connection before attempting login
    if (!isApiAvailable) {
      setApiError('Cannot connect to server. Please check your connection and try again.');
      return;
    }
    
    try {
      const success = await login({ 
        emailOrUsername, 
        password 
      });
      
      if (success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error handled in component:', error);
      
      // Handle different error types
      if (error.code === 'ERR_NETWORK') {
        setIsApiAvailable(false);
        setApiError('Connection error. Please check your internet connection and try again.');
      } else if (error.message?.includes('SSL') || error.code === 'ERR_SSL_PROTOCOL_ERROR') {
        // SSL-specific error message
        setApiError('SSL connection error. Contact your administrator to configure correct API settings.');
      } else {
        // Extract the specific error message from the API response
        const errorMessage = error.response?.data?.message || 
                           error.response?.data || 
                           error.message || 
                           'Invalid password or username';
        
        setApiError(errorMessage);
      }
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <DocuVerseLogo className="mx-auto h-14 w-auto" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-none shadow-xl">
            <CardHeader className="space-y-1 pb-2">
              <h3 className="text-xl font-semibold">Sign In</h3>
            </CardHeader>
            
            <CardContent>
              {apiError && (
                <Alert variant="destructive" className="mb-4 animate-pulse">
                  <AlertDescription className="flex items-center gap-2">
                    {!isApiAvailable && <WifiOff size={16} />}
                    {apiError.includes('SSL') && <ShieldAlert size={16} />}
                    {apiError}
                  </AlertDescription>
                </Alert>
              )}
              
              {!isApiAvailable && (
                <div className="mb-4 text-center">
                  <Button 
                    variant="outline"
                    onClick={handleRetryConnection}
                    disabled={isCheckingApi}
                    className="w-full"
                  >
                    {isCheckingApi ? 'Checking connection...' : 'Retry Connection'}
                  </Button>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailOrUsername">Login</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="emailOrUsername"
                      type="text"
                      placeholder="email@example.com or username"
                      className={`pl-10 ${errors.emailOrUsername ? 'border-red-500' : ''}`}
                      value={emailOrUsername}
                      onChange={(e) => {
                        setEmailOrUsername(e.target.value);
                        setApiError(null); // Clear API error when user types
                      }}
                    />
                  </div>
                  {errors.emailOrUsername && (
                    <p className="text-sm text-red-500">{errors.emailOrUsername}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/forgot-password" className="text-sm font-medium text-primary">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className={`pl-10 ${errors.password ? 'border-red-500' : ''}`}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setApiError(null); // Clear API error when user types
                      }}
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password}</p>
                  )}
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-docuBlue hover:bg-docuBlue-700 relative overflow-hidden group"
                  disabled={isLoading || !isApiAvailable}
                >
                  <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 ease-out group-hover:w-full"></span>
                  <span className="relative z-10">
                    {isLoading ? 'Signing in...' : 'Sign in'}
                  </span>
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4 pt-0">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-medium text-primary hover:text-primary/90"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
