
import { Outlet } from 'react-router-dom';
import { MainNavbar } from '@/components/navigation/MainNavbar';
import { SidebarNav } from '@/components/navigation/SidebarNav';
import { SidebarProvider, SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export function Layout() {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      {/* Full-screen background image with overlay */}
      <div className="min-h-screen flex flex-col bg-[#070b28] text-white w-full relative" 
           style={{ 
            backgroundImage: "url('https://www.tigernix.com/wp-content/uploads/2024/01/why-singapore-needs-automation-erp-tigernix-singapore.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}>
        {/* Background overlay */}
        <div className="absolute inset-0 bg-[#070b28]/80 z-0"></div>
        
        {/* Navigation bar - fixed position */}
        <div className={`fixed inset-x-0 top-0 z-50 ${isMobile ? 'bg-[#070b28]' : 'bg-[#070b28]/90'} backdrop-blur-lg border-b border-blue-900/30 h-16`}>
          <MainNavbar />
        </div>
        
        {/* Main content area with sidebar */}
        <div className="flex flex-1 pt-16 relative z-10">
          {/* Sidebar */}
          <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] z-20">
            <SidebarNav />
          </div>
          
          {/* Main content - with proper margin to account for sidebar */}
          <main className="flex-1 transition-all duration-200 md:ml-64 pl-0 md:pl-4 w-full">
            <div className="container mx-auto px-4 py-4 max-w-screen-2xl">
              <div className="flex justify-between items-center py-2">
                <SidebarTrigger className="md:hidden" />
              </div>
              <div className="bg-[#111633]/95 border border-blue-900/30 rounded-xl shadow-lg overflow-hidden">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
