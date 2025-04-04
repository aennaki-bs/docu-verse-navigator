
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requiredRole?: 'Admin' | 'FullUser' | 'SimpleUser' | string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    console.log('ProtectedRoute - Auth state:', { 
      isAuthenticated, 
      isLoading, 
      userId: user?.userId,
      role: user?.role,
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

  // Role-based access control
  if (requiredRole) {
    const userRole = user?.role || 'SimpleUser';
    const hasRequiredRole = Array.isArray(requiredRole) 
      ? requiredRole.includes(userRole) 
      : userRole === requiredRole;

    if (!hasRequiredRole) {
      toast.error('You do not have permission to access this page');
      return <Navigate to="/dashboard" replace />;
    }
  }

  console.log('User is authenticated, rendering protected content');
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
