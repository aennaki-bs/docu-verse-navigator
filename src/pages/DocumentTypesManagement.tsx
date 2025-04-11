
import { useState } from 'react';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import DocumentTypeTable from '@/components/document-types/DocumentTypeTable';
import { DocumentTypeForm } from '@/components/document-types/DocumentTypeForm';
import documentTypeService from '@/services/documentTypeService';
import { DocumentType } from '@/models/document';
import { useQuery } from '@tanstack/react-query';
import LoadingState from '@/components/document-types/LoadingState';
import EmptyState from '@/components/document-types/EmptyState';
import DeleteConfirmDialog from '@/components/document-types/DeleteConfirmDialog';
import BottomActionBar from '@/components/document-types/BottomActionBar';

export default function DocumentTypesManagement() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<DocumentType | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<DocumentType | null>(null);
  
  const { data: documentTypes = [], isLoading, refetch } = useQuery({
    queryKey: ['documentTypes'],
    queryFn: documentTypeService.getAllDocumentTypes,
  });
  
  const handleEdit = (documentType: DocumentType) => {
    setSelectedType(documentType);
    setIsFormOpen(true);
  };
  
  const handleDelete = (documentType: DocumentType) => {
    setTypeToDelete(documentType);
    setIsDeleteDialogOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!typeToDelete) return;
    
    try {
      await documentTypeService.deleteDocumentType(typeToDelete.id);
      toast.success('Document type deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete document type');
    }
  };
  
  const handleFormSuccess = () => {
    refetch();
    setSelectedType(undefined);
  };
  
  const handleAddNew = () => {
    setSelectedType(undefined);
    setIsFormOpen(true);
  };
  
  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Document Types</h1>
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add Document Type
        </Button>
      </div>
      
      <Card className="w-full shadow-md">
        <CardHeader className="border-b">
          <CardTitle>Document Types</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {documentTypes.length > 0 ? (
            <DocumentTypeTable
              documentTypes={documentTypes}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <EmptyState onAddNew={handleAddNew} />
          )}
        </CardContent>
      </Card>
      
      <BottomActionBar count={documentTypes.length} />
      
      <DocumentTypeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        documentType={selectedType}
        onSuccess={handleFormSuccess}
      />
      
      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        typeName={typeToDelete?.typeName || ''}
      />
    </div>
  );
}
