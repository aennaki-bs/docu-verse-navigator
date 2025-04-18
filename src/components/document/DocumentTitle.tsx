
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document } from '@/models/document';
import DocumentStatusBadge from './DocumentStatusBadge';

interface DocumentTitleProps {
  document: Document | undefined;
  isLoading: boolean;
}

const DocumentTitle = ({ document, isLoading }: DocumentTitleProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center">
      <Button 
        variant="ghost" 
        size="sm" 
        onClick={() => navigate('/documents')} 
        className="mr-4 text-blue-300 hover:text-white hover:bg-blue-800/50"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Button>
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          {isLoading ? 'Loading...' : document?.title}
          {document && <DocumentStatusBadge status={document.status} />}
        </h1>
        {document && (
          <div className="flex items-center gap-2 text-blue-300/80 mt-1">
            <span className="font-mono text-xs">{document.documentKey}</span>
            <span className="text-blue-400/50">•</span>
            <span className="text-sm">{document.documentType.typeName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentTitle;
