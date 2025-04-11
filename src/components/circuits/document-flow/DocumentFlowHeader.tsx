
import { Link } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GitBranch } from 'lucide-react';
import { Document } from '@/models/document';

interface DocumentFlowHeaderProps {
  documentId: string;
  document: Document | null;
  navigateBack: () => void;
}

export const DocumentFlowHeader = ({ documentId, document, navigateBack }: DocumentFlowHeaderProps) => {
  return (
    <>
      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-blue-400/80">
            <Link to="/documents" className="hover:text-blue-300">Documents</Link>
            <span>/</span>
            <Link to={`/documents/${documentId}`} className="hover:text-blue-300">
              {document?.documentKey || documentId}
            </Link>
            <span>/</span>
            <span className="text-blue-100">Flow</span>
          </div>
          
          <h1 className="text-3xl font-bold text-white mt-2">
            Document Circuit
          </h1>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline" 
            size="lg" 
            onClick={() => window.location.href = `/documents/${documentId}/edit`}
            className="border-blue-900/30 text-white hover:bg-blue-900/20"
          >
            <Edit className="h-5 w-5 mr-2" /> Edit Document
          </Button>
          <Button
            variant="outline" 
            size="lg" 
            onClick={navigateBack}
            className="border-blue-900/30 text-white hover:bg-blue-900/20"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Document
          </Button>
        </div>
      </div>
      
      {/* Document metadata */}
      {document && (
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="font-mono text-sm">
            {document.documentKey}
          </Badge>
          <Badge variant={document.circuitId ? "secondary" : "outline"} className="text-xs">
            <GitBranch className="mr-1 h-3 w-3" /> {document.circuitId ? document?.circuit?.title || 'Circuit' : 'No Circuit'}
          </Badge>
          <p className="text-sm text-gray-400">
            Last updated: {new Date(document.updatedAt).toLocaleDateString()}
          </p>
        </div>
      )}
    </>
  );
};
