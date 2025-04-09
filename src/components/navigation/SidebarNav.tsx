
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  GitBranch,
  CircleCheck,
  Settings,
  Users,
  Layers
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "@/components/ui/sidebar";

export function SidebarNav() {
  const { user } = useAuth();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <Sidebar className="border-r border-blue-900/30 bg-[#0a1033]/60 backdrop-blur-md md:rounded-r-xl overflow-hidden">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2 px-2">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-8 h-8 rounded flex items-center justify-center text-white font-bold">
            D
          </div>
          <span className="text-xl font-semibold bg-gradient-to-r from-blue-200 to-blue-400 text-transparent bg-clip-text">DocuVerse</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <p className="text-xs font-medium text-blue-400/80 px-4 py-2">MAIN NAVIGATION</p>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/dashboard')} 
              tooltip="Dashboard"
              asChild
              className="hover:bg-blue-800/30 data-[active=true]:bg-blue-600/40 data-[active=true]:text-blue-200"
            >
              <Link to="/dashboard">
                <LayoutDashboard className="mr-2 h-5 w-5" />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/documents')} 
              tooltip="Documents"
              asChild
              className="hover:bg-blue-800/20 data-[active=true]:bg-blue-600/30 data-[active=true]:text-blue-200"
            >
              <Link to="/documents">
                <FileText className="mr-2 h-5 w-5" />
                <span>Documents</span>
              </Link>
            </SidebarMenuButton>
            
            {/* Document Types Sub-menu */}
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  isActive={isActive('/document-types')} 
                  asChild
                >
                  <Link to="/document-types">
                    Types Overview
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton 
                  isActive={isActive('/document-types-management')} 
                  asChild
                >
                  <Link to="/document-types-management">
                    Types Management
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/circuits')} 
              tooltip="Circuits"
              asChild
              className="hover:bg-blue-800/20 data-[active=true]:bg-blue-600/30 data-[active=true]:text-blue-200"
            >
              <Link to="/circuits">
                <GitBranch className="mr-2 h-5 w-5" />
                <span>Circuits</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          
          <SidebarMenuItem>
            <SidebarMenuButton 
              isActive={isActive('/pending-approvals')} 
              tooltip="Approvals"
              asChild
              className="hover:bg-blue-800/20 data-[active=true]:bg-blue-600/30 data-[active=true]:text-blue-200"
            >
              <Link to="/pending-approvals">
                <CircleCheck className="mr-2 h-5 w-5" />
                <span>Approvals</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        
        {user?.role === 'Admin' && (
          <>
            <p className="text-xs font-medium text-blue-400/80 px-4 py-2 mt-6">ADMIN</p>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={isActive('/user-management')}
                  tooltip="User Management"
                  asChild
                  className="hover:bg-blue-800/30 data-[active=true]:bg-blue-600/40 data-[active=true]:text-blue-200"
                >
                  <Link to="/user-management">
                    <Users className="mr-2 h-5 w-5" />
                    <span>User Management</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <SidebarMenuButton 
          isActive={isActive('/profile')} 
          variant="outline" 
          tooltip="Settings"
          asChild
          className="border-blue-800/40 hover:bg-blue-800/30 data-[active=true]:bg-blue-600/40 data-[active=true]:text-blue-200"
        >
          <Link to="/profile" className="w-full">
            <Settings className="mr-2 h-5 w-5" />
            <span>Settings</span>
          </Link>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
