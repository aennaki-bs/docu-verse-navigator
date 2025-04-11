
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DocumentsHeaderProps {
  onCreateDocument: () => void;
}

export const DocumentsHeader = ({ onCreateDocument }: DocumentsHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <h1 className="text-3xl font-semibold">Documents</h1>
      <Button onClick={onCreateDocument}>
        <Plus className="mr-2 h-4 w-4" />
        Create Document
      </Button>
    </div>
  );
};
