
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { 
      isAuthenticated, 
      isLoading, 
      user,
      currentPath: location.pathname
    });
  }, [isAuthenticated, isLoading, user, location]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-docuBlue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('User is authenticated, rendering protected content');
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
