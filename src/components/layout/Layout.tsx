
import { Outlet } from "react-router-dom";
import { MainNavbar } from "@/components/navigation/MainNavbar";
import { SidebarNav } from "@/components/navigation/SidebarNav";
import {
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSettings } from "@/context/SettingsContext";

export function Layout() {
  const isMobile = useIsMobile();
  const { theme } = useSettings();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background text-foreground relative overflow-hidden">
        {/* Background image with overlay */}
        <div
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage:
              "url('https://www.tigernix.com/wp-content/uploads/2024/01/why-singapore-needs-automation-erp-tigernix-singapore.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* Background overlay */}
          <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-[#070b28]/90' : 'bg-slate-100/80'} z-0`}></div>
        </div>

        {/* Sidebar */}
        <div className="h-screen z-20 min-w-[250px] w-[250px] relative">
          <SidebarNav />
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col h-screen relative z-10">
          {/* Navigation bar - fixed position */}
          <div className={`sticky top-0 z-50 ${isMobile ? "bg-background" : "bg-background/90"} backdrop-blur-lg border-b border-border`}>
            <MainNavbar />
          </div>

          {/* Main content - with proper padding and scrolling */}
          <main className="flex-1 overflow-auto p-6">
            <div className="container mx-auto">
              <div className="flex justify-between items-center mb-4">
                <SidebarTrigger className="md:hidden" />
              </div>
              
              {/* Content container with background */}
              <div
                className={`${theme === "dark" ? "bg-[#111633]/95" : "bg-white/95"} 
                  rounded-xl shadow-lg border border-border overflow-hidden`}
              >
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
