
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

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
import Documents from "./pages/Documents";
import DocumentTypes from "./pages/DocumentTypes";
import CreateDocument from "./pages/CreateDocument";
import ViewDocument from "./pages/ViewDocument";
import EditDocument from "./pages/EditDocument";
import DocumentLignesPage from "./pages/DocumentLignesPage";
import CircuitsPage from "./pages/Circuits";
import CreateCircuit from "./pages/CreateCircuit";
import PendingApprovalsPage from "./pages/PendingApprovals";
import { Layout } from './components/layout/Layout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<EmailVerification />} />
            <Route path="/verify/:email" element={<EmailVerification />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password/:email" element={<UpdatePassword />} />
            
            {/* Protected routes with layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/admin" element={<ProtectedRoute requiredRole="Admin"><AdminPage /></ProtectedRoute>} />
                
                {/* Document routes */}
                <Route path="/documents" element={<Documents />} />
                
                {/* Management routes (Admin & FullUser only) */}
                <Route path="/document-types" element={<ProtectedRoute requiresManagement><DocumentTypes /></ProtectedRoute>} />
                <Route path="/documents/create" element={<ProtectedRoute requiresManagement requiredRole={["Admin", "FullUser"]}><CreateDocument /></ProtectedRoute>} />
                <Route path="/documents/:id" element={<ViewDocument />} />
                <Route path="/documents/:id/edit" element={<ProtectedRoute requiresManagement requiredRole={["Admin", "FullUser"]}><EditDocument /></ProtectedRoute>} />
                
                {/* Document Lignes routes */}
                <Route path="/documents/:id/lignes" element={<ProtectedRoute requiresManagement><DocumentLignesPage /></ProtectedRoute>} />
                <Route path="/documents/:id/lignes/:ligneId" element={<ViewDocument />} />
                
                {/* Document SousLignes routes */}
                <Route path="/documents/:id/lignes/:ligneId/souslignes" element={<ProtectedRoute requiresManagement><ViewDocument /></ProtectedRoute>} />
                <Route path="/documents/:id/lignes/:ligneId/souslignes/:sousLigneId" element={<ViewDocument />} />
                
                {/* Circuit Management routes - SimpleUsers can view circuits but not manage them */}
                <Route path="/circuits" element={<CircuitsPage />} />
                <Route path="/create-circuit" element={<ProtectedRoute requiresManagement requiredRole={["Admin", "FullUser"]}><CreateCircuit /></ProtectedRoute>} />
                <Route path="/pending-approvals" element={<PendingApprovalsPage />} />
              </Route>
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
