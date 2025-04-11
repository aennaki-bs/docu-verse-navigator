
import { FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DocumentEmptyStateProps {
  searchQuery?: string;
  isSimpleUser?: boolean;
}

export const DocumentEmptyState: React.FC<DocumentEmptyStateProps> = ({
  searchQuery,
  isSimpleUser,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <FilePlus className="h-16 w-16 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-400">No documents found</h3>
      {searchQuery ? (
        <p className="text-sm text-gray-500 mt-2">
          No documents match your search query: "{searchQuery}"
        </p>
      ) : (
        <p className="text-sm text-gray-500 mt-2">
          Get started by creating a new document
        </p>
      )}
      {!isSimpleUser && (
        <Button className="mt-6">
          <FilePlus className="h-4 w-4 mr-2" /> Create Document
        </Button>
      )}
    </div>
  );
};
