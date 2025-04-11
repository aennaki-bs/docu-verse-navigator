
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { File, Plus } from 'lucide-react';
import { useDocumentsFilter } from '../hooks/useDocumentsFilter';

interface DocumentsEmptyStateProps {
  canManageDocuments: boolean;
}

export default function DocumentsEmptyState({ canManageDocuments }: DocumentsEmptyStateProps) {
  const { searchQuery, dateRange } = useDocumentsFilter();

  return (
    <div className="text-center py-16">
      <File className="mx-auto h-12 w-12 text-blue-500/50" />
      <h3 className="mt-2 text-lg font-semibold text-white">No documents found</h3>
      <p className="mt-1 text-sm text-blue-300/80">
        {searchQuery || dateRange
          ? "No documents match your search criteria" 
          : canManageDocuments 
            ? "Get started by creating your first document"
            : "No documents are available for viewing"}
      </p>
      <div className="mt-6">
        {canManageDocuments ? (
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link to="/documents/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Document
            </Link>
          </Button>
        ) : (
          <Button disabled className="cursor-not-allowed opacity-60">
            <Plus className="mr-2 h-4 w-4" />
            Create Document
          </Button>
        )}
      </div>
    </div>
  );
}
