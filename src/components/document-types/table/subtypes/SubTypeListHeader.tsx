
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface SubTypeListHeaderProps {
  documentTypeName: string;
  onCreateClick: () => void;
}

export default function SubTypeListHeader({ documentTypeName, onCreateClick }: SubTypeListHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <h3 className="text-lg font-semibold text-white">
        Subtypes for {documentTypeName}
      </h3>
      <Button
        onClick={onCreateClick}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="h-4 w-4 mr-2" /> Add Subtype
      </Button>
    </div>
  );
}
