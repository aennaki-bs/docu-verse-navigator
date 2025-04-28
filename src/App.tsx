import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import DocumentsPage from './pages/documents/DocumentsPage';
import DocumentDetailsPage from './pages/documents/DocumentDetailsPage';
import DocumentEditPage from './pages/documents/DocumentEditPage';
import DocumentTypesManagementPage from './pages/document-types/DocumentTypesManagementPage';
import SubTypeManagementPage from './pages/sub-types/SubTypeManagementPage';
import CircuitsPage from './pages/circuits/CircuitsPage';
import CircuitDetailsPage from './pages/circuits/CircuitDetailsPage';
import CircuitEditPage from './pages/circuits/CircuitEditPage';
import UserManagementPage from './pages/admin/UserManagementPage';
import EditUserDialog from './components/admin/EditUserDialog';
import EditEmailDialog from './components/admin/EditEmailDialog';
import { ThemeProvider } from './components/ThemeProvider';
import ActionsManagementPage from './pages/actions/ActionsManagementPage';

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
                    <DocumentDetailsPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents/:id/edit"
              element={
                <ProtectedRoute>
                  <Layout>
                    <DocumentEditPage />
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
              path="/subtype-management/:documentTypeId"
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
                    <CircuitsPage />
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
                    <UserManagementPage />
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
