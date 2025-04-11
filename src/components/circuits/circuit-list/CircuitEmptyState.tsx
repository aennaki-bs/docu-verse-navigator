
import { FileText, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface CircuitEmptyStateProps {
  searchQuery: string;
  isSimpleUser: boolean;
}

export function CircuitEmptyState({ searchQuery, isSimpleUser }: CircuitEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {searchQuery ? (
        <>
          <Search className="h-12 w-12 text-blue-500/40 mb-4" />
          <h3 className="text-lg font-medium text-blue-300 mb-1">No matching circuits</h3>
          <p className="text-blue-400/70 max-w-md">
            We couldn't find any circuits matching "{searchQuery}". 
            Try a different search term or clear your search.
          </p>
        </>
      ) : (
        <>
          <div className="rounded-full bg-blue-900/30 p-4 mb-4">
            <FileText className="h-8 w-8 text-blue-400/70" />
          </div>
          <h3 className="text-lg font-medium text-blue-300 mb-1">No circuits found</h3>
          <p className="text-blue-400/70 max-w-md">
            {!isSimpleUser ? 
              'Create a new circuit to get started with document workflows.' : 
              'There are no circuits available for viewing at the moment.'}
          </p>
          {!isSimpleUser && (
            <Link to="/create-circuit" className="mt-4">
              <Button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Plus className="mr-2 h-4 w-4" /> New Circuit
              </Button>
            </Link>
          )}
        </>
      )}
    </div>
  );
}
