
import { Outlet } from 'react-router-dom';
import { MainNavbar } from '@/components/navigation/MainNavbar';
import { SidebarNav } from '@/components/navigation/SidebarNav';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

export function Layout() {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#070b28] text-white flex flex-col w-full relative">
        {/* Full-screen background image with overlay */}
        <div 
          className="fixed inset-0 z-[-10]" 
          style={{ 
            backgroundImage: "url('https://www.tigernix.com/wp-content/uploads/2024/01/why-singapore-needs-automation-erp-tigernix-singapore.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
          }}
        >
          {/* Dark overlay to maintain readability */}
          <div className="absolute inset-0 bg-[#070b28]/80"></div>
        </div>

        <div className="fixed top-0 z-50 w-full shadow-lg backdrop-blur-lg bg-[#0a1033]/60 border-b border-blue-900/30">
          <MainNavbar />
        </div>
        
        <div className="flex flex-1 relative mt-16"> {/* Margin-top to account for fixed navbar */}
          <SidebarNav />
          <main className="flex-1 overflow-auto transition-all duration-200">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center py-2">
                <SidebarTrigger className="md:hidden" />
              </div>
              <div className="bg-[#111633]/70 backdrop-blur-md border border-blue-900/30 dark:bg-[#111633]/70 rounded-xl shadow-lg overflow-hidden">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
