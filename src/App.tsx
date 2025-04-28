
import { Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { Layout } from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import DocumentsPage from './pages/documents/DocumentsPage';
import ViewDocument from './pages/ViewDocument';
import EditDocument from './pages/EditDocument';
import DocumentTypesManagementPage from './components/document-types/management/DocumentTypesManagementPage';
import SubTypeManagementPage from './pages/SubTypeManagement';
import Circuits from './pages/Circuits';
import { CircuitDetailsPage } from './pages/circuits/CircuitDetailsPage';
import CircuitEditPage from './pages/circuits/CircuitEditPage';
import UserManagement from './pages/UserManagement';
import { EditUserDialog } from './components/admin/EditUserDialog';
import { EditUserEmailDialog } from './components/admin/EditUserEmailDialog';
import { ThemeProvider } from './context/SettingsContext';
import { ActionsManagementPage } from './pages/actions/ActionsManagementPage';
import Login from './pages/Login';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ThemeProvider>
          <Routes>
            <Route 
              path="/login" 
              element={<Login />} 
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  {(props) => (
                    <Layout>
                      <Dashboard />
                    </Layout>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  {(props) => (
                    <Layout>
                      <Dashboard />
                    </Layout>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents"
              element={
                <ProtectedRoute>
                  {(props) => (
                    <Layout>
                      <DocumentsPage />
                    </Layout>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents/:id"
              element={
                <ProtectedRoute>
                  {(props) => (
                    <Layout>
                      <ViewDocument />
                    </Layout>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/documents/:id/edit"
              element={
                <ProtectedRoute>
                  {(props) => (
                    <Layout>
                      <EditDocument />
                    </Layout>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/document-types-management"
              element={
                <ProtectedRoute>
                  {(props) => (
                    <Layout>
                      <DocumentTypesManagementPage />
                    </Layout>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/subtype-management/:id"
              element={
                <ProtectedRoute>
                  {(props) => (
                    <Layout>
                      <SubTypeManagementPage />
                    </Layout>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/circuits"
              element={
                <ProtectedRoute>
                  {(props) => (
                    <Layout>
                      <Circuits />
                    </Layout>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/circuits/:id"
              element={
                <ProtectedRoute>
                  {(props) => (
                    <Layout>
                      <CircuitDetailsPage />
                    </Layout>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/circuits/:id/edit"
              element={
                <ProtectedRoute>
                  {(props) => (
                    <Layout>
                      <CircuitEditPage />
                    </Layout>
                  )}
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-management"
              element={
                <ProtectedRoute>
                  {(props) => (
                    <Layout>
                      <UserManagement />
                    </Layout>
                  )}
                </ProtectedRoute>
              }
            />
            
            {/* Routes for user dialogs need to be updated with correct props */}
            <Route 
              path="/edit-user/:id" 
              element={<EditUserDialog user={{id: 0, username: "", firstName: "", lastName: "", email: "", role: ""}} open={true} onOpenChange={() => {}} onSuccess={() => {}} />}
            />
            <Route 
              path="/edit-email/:id" 
              element={<EditUserEmailDialog user={{id: 0, username: "", firstName: "", lastName: "", email: "", role: ""}} open={true} onOpenChange={() => {}} onSuccess={() => {}} />}
            />
            
            <Route
              path="/actions"
              element={
                <ProtectedRoute>
                  {(props) => (
                    <Layout>
                      <Suspense fallback={<div>Loading...</div>}>
                        <ActionsManagementPage />
                      </Suspense>
                    </Layout>
                  )}
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
