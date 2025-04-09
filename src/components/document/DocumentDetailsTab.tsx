
import { FileText } from 'lucide-react';
import { Document } from '@/models/document';

interface DocumentDetailsTabProps {
  document: Document;
}

const DocumentDetailsTab = ({ document }: DocumentDetailsTabProps) => {
  const getStatusClass = (status: number) => {
    switch(status) {
      case 0:
        return 'from-amber-500/20 to-amber-600/10 border-l-amber-500';
      case 1:
        return 'from-green-500/20 to-green-600/10 border-l-green-500';
      case 2:
        return 'from-purple-500/20 to-purple-600/10 border-l-purple-500';
      default:
        return 'from-blue-500/20 to-blue-600/10 border-l-blue-500';
    }
  };

  return (
    <div className="bg-[#0a1033] rounded-lg overflow-hidden border border-blue-900/30 shadow-lg p-6 text-blue-100">
      <div className={`border-l-4 bg-gradient-to-br ${getStatusClass(document.status)} rounded-lg shadow-xl overflow-hidden`}>
        <div className="bg-gradient-to-r from-blue-800/30 to-purple-800/20 px-6 py-4 border-b border-white/5">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-300" />
              Document Details
            </h2>
            <p className="text-sm text-blue-300/80">
              Last updated: {new Date(document.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="p-6 text-blue-100">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-blue-300 mb-1">Document Type</h3>
              <p className="font-medium">{document.documentType.typeName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-300 mb-1">Document Date</h3>
              <p className="font-medium">{new Date(document.docDate).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-300 mb-1">Created By</h3>
              <p className="font-medium">{document.createdBy.firstName} {document.createdBy.lastName}</p>
              <p className="text-sm text-blue-300/70">({document.createdBy.username})</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-blue-300 mb-1">Created At</h3>
              <p className="font-medium">{new Date(document.createdAt).toLocaleString()}</p>
            </div>
          </div>
          
          <div className="border-t border-blue-400/20 pt-6 mt-6">
            <h3 className="text-sm font-medium text-blue-300 mb-3">Content</h3>
            <div className="p-4 bg-blue-950/40 rounded-md min-h-[200px] whitespace-pre-wrap border border-blue-400/20 text-blue-100">
              {document.content || "No content available."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetailsTab;
