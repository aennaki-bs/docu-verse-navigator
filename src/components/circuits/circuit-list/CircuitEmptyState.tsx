import { CircleDashed, Search } from "lucide-react";
import { useSettings } from "@/context/SettingsContext";

interface CircuitEmptyStateProps {
  searchQuery: string;
  isSimpleUser: boolean;
}

export function CircuitEmptyState({
  searchQuery,
  isSimpleUser,
}: CircuitEmptyStateProps) {
  const isSearching = searchQuery.trim() !== "";
  const { theme } = useSettings();

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div
        className={`mb-4 p-4 rounded-full ${
          theme === "dark" ? "bg-blue-900/30" : "bg-blue-100"
        }`}
      >
        {isSearching ? (
          <Search
            className={`h-10 w-10 ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          />
        ) : (
          <CircleDashed
            className={`h-10 w-10 ${
              theme === "dark" ? "text-blue-400" : "text-blue-600"
            }`}
          />
        )}
      </div>

      <h3
        className={`text-xl font-medium mb-2 ${
          theme === "dark" ? "text-white" : "text-blue-800"
        }`}
      >
        {isSearching ? "No matches found" : "No circuits available"}
      </h3>

      <p
        className={`max-w-md ${
          theme === "dark" ? "text-blue-300" : "text-blue-600"
        }`}
      >
        {isSearching ? (
          <>
            No circuits match your search criteria:{" "}
            <span
              className={`font-medium ${
                theme === "dark" ? "text-blue-200" : "text-blue-700"
              }`}
            >
              "{searchQuery}"
            </span>
            . Try different keywords or clear your search.
          </>
        ) : isSimpleUser ? (
          "There are no circuits configured yet. Please contact an administrator."
        ) : (
          "Get started by creating your first circuit."
        )}
      </p>
    </div>
  );
}
