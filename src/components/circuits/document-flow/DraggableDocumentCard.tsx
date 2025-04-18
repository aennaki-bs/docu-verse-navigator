
import { Card, CardContent } from '@/components/ui/card';
import { Document } from '@/models/document';
import { File, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DraggableDocumentCardProps {
  document: Document;
  onDragStart?: () => void;
}

export const DraggableDocumentCard = ({ document, onDragStart }: DraggableDocumentCardProps) => {
  const handleDragStart = (e: React.DragEvent) => {
    // Set the data being dragged
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ documentId: document.id, documentKey: document.documentKey })
    );
    
    if (onDragStart) {
      onDragStart();
    }
  };
  
  return (
    <Card 
      draggable 
      onDragStart={handleDragStart}
      className="bg-blue-800/20 border border-blue-400/20 hover:bg-blue-800/30 transition-colors cursor-move"
    >
      <CardContent className="p-1.5 flex items-center space-x-2">
        <div className="bg-blue-500/20 p-1 rounded-full">
          <FileText className="h-3 w-3 text-blue-300" />
        </div>
        <div className="flex flex-col overflow-hidden">
          <span className="text-xs font-medium text-white truncate">
            {document.title}
          </span>
          <div className="flex items-center gap-1">
            <Badge variant="outline" className="px-1 py-0 text-[9px]">
              {document.documentKey}
            </Badge>
            {document.documentType && (
              <span className="text-[9px] text-gray-400 truncate">
                {document.documentType.typeName}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
