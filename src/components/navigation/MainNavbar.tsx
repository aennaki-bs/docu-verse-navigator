import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings, Bell, ChevronDown } from "lucide-react";
import { GlobalSearch } from "./GlobalSearch";
import { useSettings } from "@/context/SettingsContext";

export function MainNavbar() {
  const { user, logout } = useAuth();
  const { theme } = useSettings();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav
      className={`h-16 shadow-md w-full border-b ${
        theme === "dark"
          ? "border-blue-900/30 bg-[#0a1033]/95 backdrop-blur-sm"
          : "border-blue-100 bg-white"
      }`}
    >
      <div className="container h-full mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center md:w-64">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 w-8 h-8 rounded flex items-center justify-center text-white font-bold">
              D
            </div>
            <span className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-transparent bg-clip-text">
              DocuVerse
            </span>
          </Link>
        </div>

        {/* Global Search */}
        <div className="hidden md:flex flex-1 max-w-md mx-6">
          <GlobalSearch />
        </div>

        {user ? (
          <div className="flex items-center space-x-4 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              className={`relative ${
                theme === "dark"
                  ? "text-blue-300 hover:text-white hover:bg-blue-800/30"
                  : "text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              }`}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 ${
                    theme === "dark"
                      ? "text-blue-100 hover:bg-blue-800/30"
                      : "text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p
                      className={`text-xs ${
                        theme === "dark" ? "text-blue-300" : "text-blue-500"
                      }`}
                    >
                      {user.role}
                    </p>
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.profilePicture}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown
                    className={`h-4 w-4 ${
                      theme === "dark" ? "text-blue-300" : "text-blue-400"
                    }`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className={`w-56 ${
                  theme === "dark"
                    ? "bg-[#0a1033] border-blue-900/50 text-blue-100"
                    : "bg-white border-blue-100 text-blue-800"
                }`}
              >
                <DropdownMenuLabel>My Account</DropdownMenuLabel>

                <DropdownMenuSeparator
                  className={
                    theme === "dark" ? "bg-blue-800/30" : "bg-blue-100"
                  }
                />

                <DropdownMenuItem asChild>
                  <Link
                    to="/profile"
                    className={`flex items-center cursor-pointer w-full ${
                      theme === "dark"
                        ? "hover:bg-blue-800/30"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    <User className="mr-2 h-4 w-4" /> Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link
                    to="/settings"
                    className={`flex items-center cursor-pointer w-full ${
                      theme === "dark"
                        ? "hover:bg-blue-800/30"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator
                  className={
                    theme === "dark" ? "bg-blue-800/30" : "bg-blue-100"
                  }
                />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className={`flex items-center cursor-pointer text-red-400 focus:text-red-400 ${
                    theme === "dark"
                      ? "hover:bg-blue-800/30"
                      : "hover:bg-red-50"
                  }`}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className={
                  theme === "dark"
                    ? "text-blue-300 hover:text-white hover:bg-blue-800/30"
                    : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                }
              >
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button
                size="sm"
                className={
                  theme === "dark"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                }
              >
                Register
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
