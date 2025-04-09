
import { FileText, Layers, Plus } from 'lucide-react';
import { Document, Ligne } from '@/models/document';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LignesList from '@/components/document/LignesList';

interface DocumentLinesTabProps {
  document: Document;
  lignes: Ligne[];
  canManageDocuments: boolean;
  isCreateDialogOpen: boolean;
  setIsCreateDialogOpen: (open: boolean) => void;
}

const DocumentLinesTab = ({ 
  document, 
  lignes, 
  canManageDocuments,
  isCreateDialogOpen,
  setIsCreateDialogOpen
}: DocumentLinesTabProps) => {
  return (
    <div className="bg-[#0a1033] rounded-lg overflow-hidden border border-blue-900/30 shadow-lg p-5 space-y-6">
      <div className="flex justify-between items-center bg-blue-900/30 p-4 rounded-lg">
        <div className="flex items-center gap-3">
          <div className="bg-blue-800/50 rounded-full p-2">
            <Layers className="h-6 w-6 text-blue-300" />
          </div>
          <h2 className="text-xl font-bold text-white">Document Lines</h2>
        </div>
        
        <Badge className="bg-blue-800/50 text-blue-200 border border-blue-500/30 py-1.5 px-4">
          <FileText className="h-4 w-4 mr-2" /> {lignes.length} Lines
        </Badge>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-medium text-white">Manage Document Lines</h3>
        </div>
        
        {canManageDocuments && (
          <Button 
            onClick={() => setIsCreateDialogOpen(true)} 
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Add New Line
          </Button>
        )}
      </div>

      <div>
        <LignesList
          document={document}
          lignes={lignes}
          canManageDocuments={canManageDocuments}
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
        />
      </div>
    </div>
  );
};

export default DocumentLinesTab;
