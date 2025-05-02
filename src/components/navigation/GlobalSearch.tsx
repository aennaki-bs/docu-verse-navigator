import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  X,
  LayoutDashboard,
  FileText,
  GitBranch,
  Layers,
  Users,
  PlayCircle,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useOnClickOutside } from "@/hooks/use-click-outside";
import { useSettings } from "@/context/SettingsContext";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Define navigation pages with their paths, titles, and icons
const navigationPages = [
  {
    path: "/dashboard",
    title: "Dashboard",
    description: "Main dashboard with overview",
    icon: <LayoutDashboard className="h-4 w-4 mr-2" />,
  },
  {
    path: "/user-management",
    title: "User Management",
    description: "Manage users and permissions",
    icon: <Users className="h-4 w-4 mr-2" />,
    adminOnly: true,
  },
  {
    path: "/documents",
    title: "Documents",
    description: "View and manage documents",
    icon: <FileText className="h-4 w-4 mr-2" />,
  },
  {
    path: "/document-types-management",
    title: "Types Management",
    description: "Manage document types",
    icon: <Layers className="h-4 w-4 mr-2" />,
    noSimpleUser: true,
  },
  {
    path: "/circuits",
    title: "Circuits",
    description: "Workflow circuits",
    icon: <GitBranch className="h-4 w-4 mr-2" />,
    noSimpleUser: true,
  },
  {
    path: "/actions",
    title: "Actions",
    description: "Manage workflow actions",
    icon: <PlayCircle className="h-4 w-4 mr-2" />,
    noSimpleUser: true,
  },
];

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme } = useSettings();

  const isAdmin = user?.role === "Admin";
  const isSimpleUser = user?.role === "SimpleUser";

  const filteredPages = navigationPages.filter((page) => {
    // Filter by user permissions
    if (page.adminOnly && !isAdmin) return false;
    if (page.noSimpleUser && isSimpleUser) return false;

    // Filter by search query
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      page.title.toLowerCase().includes(query) ||
      page.description.toLowerCase().includes(query)
    );
  });

  useEffect(() => {
    // Listen for keyboard shortcut to open search (Ctrl+K or Cmd+K)
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <Button
        variant="ghost"
        className={`relative w-full max-w-md items-center justify-start ${
          theme === "dark"
            ? "bg-blue-900/20 border-blue-800/30 text-white hover:bg-blue-900/30"
            : "bg-blue-50 border border-blue-100 text-blue-800 hover:bg-blue-100"
        }`}
        onClick={() => setIsOpen(true)}
      >
        <Search
          className={`h-4 w-4 mr-2 ${
            theme === "dark" ? "text-blue-300/70" : "text-blue-500"
          }`}
        />
        <span
          className={theme === "dark" ? "text-blue-300/70" : "text-blue-500"}
        >
          Search pages... (Press "/" or Ctrl+K)
        </span>
        <kbd
          className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 hidden md:inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium opacity-100 ${
            theme === "dark"
              ? "border-blue-800 bg-blue-950 text-blue-300"
              : "border-blue-200 bg-blue-100 text-blue-600"
          }`}
        >
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>

      <CommandDialog open={isOpen} onOpenChange={setIsOpen}>
        <CommandInput
          placeholder="Search for pages..."
          value={searchQuery}
          onValueChange={setSearchQuery}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {filteredPages.map((page) => (
              <CommandItem
                key={page.path}
                onSelect={() => handleNavigation(page.path)}
                className="flex items-center"
              >
                {page.icon}
                <div>
                  <p>{page.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {page.description}
                  </p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
