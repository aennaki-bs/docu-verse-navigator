import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Welcome from "./pages/Welcome";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import ProtectedRoute from "./components/ProtectedRoute";
import EmailVerification from "./components/register/EmailVerification";
import AdminPage from "./pages/Admin";
import DocumentsPageWrapper from "./pages/documents/DocumentsPageWrapper";
import DocumentTypes from "./pages/DocumentTypes";
import DocumentTypesManagement from "./pages/DocumentTypesManagement";
import SubTypeManagement from "./pages/SubTypeManagement";
import CreateDocument from "./pages/CreateDocument";
import ViewDocument from "./pages/ViewDocument";
import EditDocument from "./pages/EditDocument";
import DocumentLignesPage from "./pages/DocumentLignesPage";
import CircuitsPage from "./pages/Circuits";
import CircuitStepsPage from "./pages/CircuitStepsPage";
import StepStatusesPage from "./pages/StepStatusesPage";
import PendingApprovalsPage from "./pages/PendingApprovals";
import UserManagement from "./pages/UserManagement";
import DocumentFlowPage from "./pages/DocumentFlowPage";
import { Layout } from './components/layout/Layout';
import Settings from "./pages/Settings";
import { SettingsProvider } from "./context/SettingsContext";
import SubTypeManagementPage from "./pages/SubTypeManagementPage";
import RegistrationSuccess from "./pages/RegistrationSuccess";
import ActionsManagementPage from "./pages/ActionsManagementPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Component that listens for auth expiration events
const AuthListener = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  useEffect(() => {
    // Ensure we're in a browser environment
    if (typeof window === 'undefined') {
      console.warn('AuthListener: Not in browser environment, skipping event listeners');
      return;
    }
    
    // Keep track of if this component is mounted
    let isMounted = true;
    
    // Variable to track if we're currently processing an auth expiration
    let isProcessingExpiration = false;
    
    const handleAuthExpired = (event: Event) => {
      // Prevent duplicate handling
      if (isProcessingExpiration) return;
      
      console.log('Auth expired event received in AuthListener');
      isProcessingExpiration = true;
      
      // Show a toast notification
      toast.error('Authentication expired', {
        description: 'Please log in again to continue.',
        duration: 5000
      });
      
      // Use setTimeout to ensure we're not creating a refresh loop
      setTimeout(() => {
        // Only proceed if still mounted
        if (isMounted) {
          // Log the user out through the auth context
          logout(navigate);
        }
        isProcessingExpiration = false;
      }, 100);
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    
    return () => {
      isMounted = false;
      window.removeEventListener('auth:expired', handleAuthExpired);
    };
  }, [logout, navigate]);

  return null; // This component doesn't render anything
};

// Helper component that handles automatic redirection based on auth status
const IndexRedirect = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Show nothing while checking authentication state
  if (isLoading) return null;
  
  // If user is authenticated, redirect to dashboard, otherwise show the landing page
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SettingsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <AuthListener />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<IndexRedirect />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/registration-success" element={<RegistrationSuccess />} />
              <Route path="/verify-email" element={<EmailVerification />} />
              <Route path="/verify/:email" element={<EmailVerification />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password/:email" element={<UpdatePassword />} />
              
              {/* Protected routes with layout */}
              <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<ProtectedRoute requiredRole="Admin"><AdminPage /></ProtectedRoute>} />
                <Route path="/user-management" element={<ProtectedRoute requiredRole="Admin"><UserManagement /></ProtectedRoute>} />
                
                {/* Document Types Management routes */}
                <Route path="/document-types" element={<DocumentTypes />} />
                <Route path="/document-types-management" element={<ProtectedRoute requiresManagement requiredRole={["Admin", "FullUser"]}><DocumentTypesManagement /></ProtectedRoute>} />
                
                {/* Document routes */}
                <Route path="/documents" element={<DocumentsPageWrapper />} />
                <Route path="/documents/:id" element={<ViewDocument />} />
                
                {/* Document Types Management routes */}
                <Route path="/document-types" element={<DocumentTypes />} />
                <Route path="/document-types-management" element={<ProtectedRoute requiresManagement requiredRole={["Admin", "FullUser"]}><DocumentTypesManagement /></ProtectedRoute>} />
                <Route path="/document-types/:id/subtypes" element={<ProtectedRoute requiresManagement requiredRole={["Admin", "FullUser"]}><SubTypeManagementPage /></ProtectedRoute>} />
                
                {/* Add the missing subtype-management route */}
                <Route path="/subtype-management" element={<ProtectedRoute requiresManagement requiredRole={["Admin", "FullUser"]}><SubTypeManagement /></ProtectedRoute>} />
                
                <Route path="/documents/create" element={<ProtectedRoute requiresManagement requiredRole={["Admin", "FullUser"]}><CreateDocument /></ProtectedRoute>} />
                
                <Route path="/documents/:id/edit" element={<ProtectedRoute requiresManagement requiredRole={["Admin", "FullUser"]}><EditDocument /></ProtectedRoute>} />
                <Route path="/documents/:id/flow" element={<DocumentFlowPage />} />
                
                {/* Document Lignes routes */}
                <Route path="/documents/:id/lignes" element={<ProtectedRoute requiresManagement><DocumentLignesPage /></ProtectedRoute>} />
                <Route path="/documents/:id/lignes/:ligneId" element={<ViewDocument />} />
                
                {/* Document SousLignes routes */}
                <Route path="/documents/:id/lignes/:ligneId/souslignes" element={<ProtectedRoute requiresManagement><ViewDocument /></ProtectedRoute>} />
                <Route path="/documents/:id/lignes/:ligneId/souslignes/:sousLigneId" element={<ViewDocument />} />
                
                {/* Circuit Management routes */}
                <Route path="/circuits" element={<CircuitsPage />} />
                <Route path="/circuits/:circuitId/steps" element={<CircuitStepsPage />} />
                <Route path="/circuits/:circuitId/steps/:stepId/statuses" element={<StepStatusesPage />} />
                <Route path="/pending-approvals" element={<PendingApprovalsPage />} />
                
                {/* Actions Management route */}
                <Route path="/actions" element={<ProtectedRoute requiresManagement requiredRole={["Admin", "FullUser"]}><ActionsManagementPage /></ProtectedRoute>} />
                
                {/* Settings route */}
                <Route path="/settings" element={<Settings />} />
              </Route>
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </SettingsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
