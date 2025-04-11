
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Document } from '@/models/document';
import { DataTable } from "@/components/ui/data-table";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDocumentsData } from './hooks/useDocumentsData';
import { useDocumentsFilter } from './hooks/useDocumentsFilter';
import { useDocumentActions } from './hooks/useDocumentActions';
import { DocumentsHeader } from './components/DocumentsHeader';
import { DocumentsTableColumns } from './components/DocumentsTableColumns';
import { DocumentDeleteDialog } from './components/DocumentDeleteDialog';

const DocumentsPage = () => {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useDocumentsFilter();
  const { documents, isLoading, refetch } = useDocumentsData();
  const { handleCreateDocument, handleEditDocument, handleDeleteDocument, handleViewDocumentFlow } = 
    useDocumentActions(navigate, refetch);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const openDeleteDialog = (document: Document) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };
  
  const columns = DocumentsTableColumns({
    handleEditDocument,
    handleViewDocumentFlow,
    openDeleteDialog,
    refetchDocuments: refetch
  });

  return (
    <div className="container mx-auto py-10">
      <DocumentsHeader onCreateDocument={handleCreateDocument} />

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search documents..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full max-w-md pl-9"
        />
      </div>

      {documents && (
        <div className="rounded-md border">
          <DataTable columns={columns} data={documents} />
        </div>
      )}
      
      {selectedDocument && (
        <DocumentDeleteDialog
          document={selectedDocument}
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={() => {
            if (selectedDocument) {
              handleDeleteDocument(selectedDocument);
              setDeleteDialogOpen(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default DocumentsPage;
