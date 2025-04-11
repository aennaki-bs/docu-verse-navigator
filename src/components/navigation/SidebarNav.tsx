
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  CircleCheck,
  Settings,
  Users
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

export function SidebarNav() {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="w-64 h-full bg-[#0a1033]/95 backdrop-blur-lg border-r border-blue-900/30 overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center space-x-2 px-2">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-8 h-8 rounded flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-blue-200 to-blue-400 text-transparent bg-clip-text">DocuVerse</span>
        </div>
      </div>
      
      <div className="px-4 py-2">
        <p className="text-xs font-medium text-blue-400/80 px-2 py-2">MAIN NAVIGATION</p>
        <ul className="space-y-1">
          <li>
            <Link 
              to="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/dashboard') 
                  ? 'bg-blue-600/40 text-blue-200' 
                  : 'text-blue-100 hover:bg-blue-800/30 hover:text-blue-50'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </li>
          
          <li className="space-y-1">
            <Link 
              to="/documents"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/documents') 
                  ? 'bg-blue-600/40 text-blue-200' 
                  : 'text-blue-100 hover:bg-blue-800/30 hover:text-blue-50'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>Documents</span>
            </Link>
            
            <div className="pl-3 ml-4 border-l border-blue-800/50 space-y-1">
              <Link 
                to="/document-types"
                className={`block px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  isActive('/document-types') 
                    ? 'bg-blue-600/30 text-blue-200' 
                    : 'text-blue-300 hover:bg-blue-800/20 hover:text-blue-100'
                }`}
              >
                Types Overview
              </Link>
              <Link 
                to="/document-types-management"
                className={`block px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  isActive('/document-types-management') 
                    ? 'bg-blue-600/30 text-blue-200' 
                    : 'text-blue-300 hover:bg-blue-800/20 hover:text-blue-100'
                }`}
              >
                Types Management
              </Link>
            </div>
          </li>
          
          <li>
            <Link 
              to="/circuits"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/circuits') 
                  ? 'bg-blue-600/40 text-blue-200' 
                  : 'text-blue-100 hover:bg-blue-800/30 hover:text-blue-50'
              }`}
            >
              <GitBranch className="h-5 w-5" />
              <span>Circuits</span>
            </Link>
          </li>
          
          <li>
            <Link 
              to="/pending-approvals"
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/pending-approvals') 
                  ? 'bg-blue-600/40 text-blue-200' 
                  : 'text-blue-100 hover:bg-blue-800/30 hover:text-blue-50'
              }`}
            >
              <CircleCheck className="h-5 w-5" />
              <span>Approvals</span>
            </Link>
          </li>
        </ul>
      </div>
      
      {user?.role === 'Admin' && (
        <div className="px-4 py-2 mt-4">
          <p className="text-xs font-medium text-blue-400/80 px-2 py-2">ADMIN</p>
          <ul className="space-y-1">
            <li>
              <Link 
                to="/user-management"
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/user-management') 
                    ? 'bg-blue-600/40 text-blue-200' 
                    : 'text-blue-100 hover:bg-blue-800/30 hover:text-blue-50'
                }`}
              >
                <Users className="h-5 w-5" />
                <span>User Management</span>
              </Link>
            </li>
          </ul>
        </div>
      )}
      
      <div className="px-4 py-2 mt-4 absolute bottom-0 w-full pb-4">
        <Link 
          to="/profile"
          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors border border-blue-800/40 ${
            isActive('/profile') 
              ? 'bg-blue-600/40 text-blue-200' 
              : 'text-blue-100 hover:bg-blue-800/30 hover:text-blue-50'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </div>
    </div>
  );
}
