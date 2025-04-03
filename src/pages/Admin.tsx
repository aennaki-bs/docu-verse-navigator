
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserTable } from '@/components/admin/UserTable';
import { CreateUserDialog } from '@/components/admin/CreateUserDialog';
import { Button } from '@/components/ui/button';
import { UserPlus } from 'lucide-react';

const AdminPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'Admin') {
      toast.error('You do not have permission to access the admin panel');
      navigate('/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => setIsCreateUserOpen(true)} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Create User
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <UserTable />
      </div>

      <CreateUserDialog 
        open={isCreateUserOpen} 
        onOpenChange={setIsCreateUserOpen}
      />
    </div>
  );
};

export default AdminPage;
