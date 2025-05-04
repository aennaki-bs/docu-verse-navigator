import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FolderPlus, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddType: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddType }) => {
  const handleAddTypeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Add document type button clicked in EmptyState");
    if (typeof onAddType === 'function') {
      try {
        onAddType();
        console.log("onAddType callback executed");
      } catch (error) {
        console.error("Error in onAddType callback:", error);
      }
    } else {
      console.error("onAddType is not a function:", onAddType);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <Card className="border border-dashed border-blue-900/40 bg-blue-950/20 max-w-lg w-full">
        <CardContent className="p-0">
          <div className="text-center py-20 px-6">
            <div className="bg-blue-900/20 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderPlus className="h-12 w-12 text-blue-300" />
            </div>
            <h3 className="text-2xl font-semibold mb-2 text-white">No document types found</h3>
            <p className="text-blue-300 mb-8 max-w-md mx-auto">
              Document types help categorize your documents. Start by creating your first document type.
            </p>
            <Button 
              onClick={handleAddTypeClick} 
              className="px-8 py-6 text-base bg-blue-600 hover:bg-blue-700 transition-colors"
              size="lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              Add Document Type
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyState;
