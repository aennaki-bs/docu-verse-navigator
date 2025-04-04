
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

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
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/update-password/:email" element={<UpdatePassword />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/document-types" element={<DocumentTypes />} />
              <Route path="/documents/create" element={<CreateDocument />} />
              <Route path="/documents/:id" element={<ViewDocument />} />
              <Route path="/documents/:id/edit" element={<EditDocument />} />
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
