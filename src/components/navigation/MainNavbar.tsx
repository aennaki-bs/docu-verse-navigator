
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  FileText, 
  GitBranch, 
  CircleCheck,
  Home, 
  LogOut, 
  Settings, 
  User,
  ChevronDown
} from 'lucide-react';

export function MainNavbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link to="/dashboard" className="text-xl font-semibold">DocuVerse</Link>
          
          {user && (
            <div className="hidden md:flex space-x-6">
              <Link to="/dashboard" className="flex items-center text-sm font-medium hover:text-primary">
                <Home className="mr-1 h-4 w-4" /> Dashboard
              </Link>
              <Link to="/documents" className="flex items-center text-sm font-medium hover:text-primary">
                <FileText className="mr-1 h-4 w-4" /> Documents
              </Link>
              <Link to="/circuits" className="flex items-center text-sm font-medium hover:text-primary">
                <GitBranch className="mr-1 h-4 w-4" /> Circuits
              </Link>
              <Link to="/pending-approvals" className="flex items-center text-sm font-medium hover:text-primary">
                <CircleCheck className="mr-1 h-4 w-4" /> Approvals
              </Link>
            </div>
          )}
        </div>
        
        {user ? (
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline text-sm text-muted-foreground">
              {user.firstName} {user.lastName}
            </span>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span className="md:hidden">Menu</span>
                  <span className="hidden md:inline">Account</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center cursor-pointer w-full">
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>
                
                {user.role === 'Admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center cursor-pointer w-full">
                      <Settings className="mr-2 h-4 w-4" /> Admin
                    </Link>
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" size="sm">Login</Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Register</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
