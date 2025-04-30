import { Input } from "@/components/ui/input";
import { SearchColumn } from "../hooks/useUserManagement";

export function UserTableHeader({
  searchQuery,
  setSearchQuery,
  searchColumns,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchColumns: SearchColumn[];
}) {
  const getPlaceholderText = () => {
    if (searchColumns.length === 5) return "Search users...";

    const columnNames = searchColumns.map((column) => {
      switch (column) {
        case "username":
          return "Username";
        case "email":
          return "Email";
        case "firstName":
          return "First Name";
        case "lastName":
          return "Last Name";
        case "role":
          return "Role";
      }
    });

    return `Search by ${columnNames.join(", ")}...`;
  };

  return (
    <div className="mb-4">
      <div className="relative w-full">
        <Input
          placeholder={getPlaceholderText()}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-[#0d1424] border-gray-700 text-white pl-10"
        />
        <svg
          className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  );
}
