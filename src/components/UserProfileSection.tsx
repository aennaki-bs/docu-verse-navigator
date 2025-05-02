import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSettings } from "@/context/SettingsContext";

export function UserProfileSection() {
  const { user } = useAuth();
  const { theme } = useSettings();

  if (!user) return null;

  return (
    <div
      className={`p-4 border-b ${
        theme === "dark"
          ? "border-blue-900/30 bg-blue-950/30"
          : "border-blue-100 bg-blue-50"
      }`}
    >
      <div className="flex items-center space-x-3">
        <Avatar className="h-12 w-12 border-2 border-blue-500">
          <AvatarImage
            src={user.profilePicture}
            alt={`${user.firstName} ${user.lastName}`}
            className="object-cover"
          />
          <AvatarFallback className="bg-blue-600 text-white text-lg">
            {user.firstName?.[0]}
            {user.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2
            className={`text-base font-semibold truncate ${
              theme === "dark" ? "text-white" : "text-blue-900"
            }`}
          >
            {user.firstName} {user.lastName}
          </h2>
          <p
            className={`text-xs truncate ${
              theme === "dark" ? "text-blue-300" : "text-blue-600"
            }`}
          >
            {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}
