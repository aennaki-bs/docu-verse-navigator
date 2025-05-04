import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { MultiStepFormProvider } from '@/context/form';
import RegisterForm from './register/RegisterForm';
import GlobalStyles from './register/GlobalStyles';

const Register = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // If already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MultiStepFormProvider>
      <GlobalStyles />
      <RegisterForm />
    </MultiStepFormProvider>
  );
};

export default Register;
