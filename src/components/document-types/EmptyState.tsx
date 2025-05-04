import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FolderPlus, Plus } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface EmptyStateProps {
  onAddType: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddType }) => {
  const { theme } = useSettings();

  // Theme-specific styles
  const cardBgClass = theme === 'dark' 
    ? 'border-blue-900/40 bg-blue-950/20' 
    : 'border-blue-200 bg-blue-50';
  
  const iconBgClass = theme === 'dark' 
    ? 'bg-blue-900/20 text-blue-300' 
    : 'bg-blue-100 text-blue-500';
  
  const titleClass = theme === 'dark' 
    ? 'text-white' 
    : 'text-gray-800';
  
  const descClass = theme === 'dark' 
    ? 'text-blue-300' 
    : 'text-gray-600';
  
  const buttonClass = theme === 'dark'
    ? 'bg-blue-600 hover:bg-blue-700'
    : 'bg-blue-500 hover:bg-blue-600';

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
      <Card className={`border border-dashed ${cardBgClass} max-w-lg w-full`}>
        <CardContent className="p-0">
          <div className="text-center py-20 px-6">
            <div className={`${iconBgClass} w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6`}>
              <FolderPlus className="h-12 w-12" />
            </div>
            <h3 className={`text-2xl font-semibold mb-2 ${titleClass}`}>No document types found</h3>
            <p className={`${descClass} mb-8 max-w-md mx-auto`}>
              Document types help categorize your documents. Start by creating your first document type.
            </p>
            <Button 
              onClick={handleAddTypeClick} 
              className={`px-8 py-6 text-base ${buttonClass} transition-colors`}
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
