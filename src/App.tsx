
import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import DocumentsPage from './pages/documents/DocumentsPage';
import ViewDocument from './pages/ViewDocument';
import EditDocument from './pages/EditDocument';
import { DocumentTypesManagementPage } from './components/document-types/management/DocumentTypesManagementPage';
import SubTypeManagementPage from './pages/SubTypeManagement';
import Circuits from './pages/Circuits';
import CircuitStepsPage from './pages/CircuitStepsPage';
import { CircuitDetailsPage } from './pages/circuits/CircuitDetailsPage';
import CircuitEditPage from './pages/circuits/CircuitEditPage';
import UserManagement from './pages/UserManagement';
import { EditUserDialog } from './components/admin/EditUserDialog';
import { EditEmailDialog } from './components/admin/EditUserEmailDialog';
import { ThemeProvider } from './context/SettingsContext';
import { ActionsManagementPage } from './pages/actions/ActionsManagementPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DocumentsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <ViewDocument />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <EditDocument />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/document-types-management"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DocumentTypesManagementPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/subtype-management/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <SubTypeManagementPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/circuits"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Circuits />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/circuits/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CircuitDetailsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/circuits/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CircuitEditPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UserManagement />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="/edit-user/:id" element={<EditUserDialog />} />
            <Route path="/edit-email/:id" element={<EditEmailDialog />} />
            
            <Route
              path="/actions"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Suspense fallback={<div>Loading...</div>}>
                      <ActionsManagementPage />
                    </Suspense>
                  </Layout>
                </ProtectedRoute>
              }
            />
            
          </Routes>
        </ThemeProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
