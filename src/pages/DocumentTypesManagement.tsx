import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { DocumentTypeForm } from '@/components/document-types/DocumentTypeForm';
import documentTypeService from '@/services/documentTypeService';
import { DocumentType } from '@/models/document';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';

const DocumentTypesManagement = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState<DocumentType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [documentTypeToDelete, setDocumentTypeToDelete] = useState<DocumentType | null>(null);

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const fetchDocumentTypes = async () => {
    setIsLoading(true);
    try {
      const types = await documentTypeService.getAllDocumentTypes();
      setDocumentTypes(types);
    } catch (error) {
      console.error('Error fetching document types:', error);
      toast.error('Failed to load document types');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedDocumentType(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (documentType: DocumentType) => {
    setSelectedDocumentType(documentType);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (documentType: DocumentType) => {
    setDocumentTypeToDelete(documentType);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentTypeToDelete) return;

    try {
      await documentTypeService.deleteDocumentType(documentTypeToDelete.id);
      toast.success(`Document type "${documentTypeToDelete.typeName}" deleted successfully`);
      fetchDocumentTypes();
    } catch (error) {
      console.error('Error deleting document type:', error);
      toast.error('Failed to delete document type');
    } finally {
      setIsDeleteDialogOpen(false);
      setDocumentTypeToDelete(null);
    }
  };

  const handleFormSuccess = () => {
    fetchDocumentTypes();
  };

  const filteredDocumentTypes = documentTypes.filter(type =>
    type.typeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Document Types Management</h1>
        <Button onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" /> Add Document Type
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Search Document Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Search className="mr-2 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by type name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Types</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading document types...</div>
          ) : filteredDocumentTypes.length === 0 ? (
            <div className="text-center py-4">
              {searchQuery ? 'No document types match your search' : 'No document types found'}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type Name</TableHead>
                  <TableHead>Type Attribute</TableHead>
                  <TableHead>Type Key</TableHead>
                  <TableHead>Document Counter</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocumentTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell className="font-medium">{type.typeName}</TableCell>
                    <TableCell>{type.typeAttr || '-'}</TableCell>
                    <TableCell>{type.typeKey || '-'}</TableCell>
                    <TableCell>{type.documentCounter || 0}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(type)}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteClick(type)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DocumentTypeForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        documentType={selectedDocumentType}
        onSuccess={handleFormSuccess}
      />

      <DeleteConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteConfirm}
        title="Delete Document Type"
        description={
          documentTypeToDelete
            ? `Are you sure you want to delete the document type "${documentTypeToDelete.typeName}"? This action cannot be undone.`
            : 'Are you sure you want to delete this document type?'
        }
      />
    </div>
  );
};

export default DocumentTypesManagement;
