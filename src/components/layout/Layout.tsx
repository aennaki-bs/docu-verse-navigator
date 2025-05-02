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
      <div
        className="min-h-screen w-full flex flex-col bg-background text-foreground relative"
        style={{
          backgroundImage:
            theme === "dark"
              ? "url('https://www.tigernix.com/wp-content/uploads/2024/01/why-singapore-needs-automation-erp-tigernix-singapore.jpg')"
              : "",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Dark overlay for background in dark mode */}
        {theme === "dark" && (
          <div className="absolute inset-0 bg-[#070b28]/90 z-0"></div>
        )}

        {/* Light mode subtle gradient background */}
        {theme === "light" && (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white z-0"></div>
        )}

        {/* Main layout structure - z-10 to appear above the overlay */}
        <div className="relative flex h-screen overflow-hidden z-10">
          {/* Sidebar - hidden on mobile unless triggered */}
          <aside
            className={`h-full ${
              isMobile ? "hidden" : "w-64 flex-shrink-0"
            } transition-all duration-200 z-20`}
          >
            <SidebarNav />
          </aside>

          {/* Main content area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Top navbar */}
            <header className="z-30">
              <div className="flex items-center">
                {isMobile && <SidebarTrigger className="p-2" />}
                <MainNavbar />
              </div>
            </header>

            {/* Main content */}
            <main className="flex-1 overflow-auto p-4">
              <div
                className={`h-full rounded-xl border overflow-auto ${
                  theme === "dark"
                    ? "bg-[#111633]/95 border-blue-900/30 shadow-lg"
                    : "bg-white border-blue-100 shadow-md"
                }`}
              >
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
