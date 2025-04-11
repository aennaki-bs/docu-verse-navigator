import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, FileText, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import documentService from '@/services/documentService';
import { Document } from '@/models/document';
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
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import CreateDocumentDialog from '@/components/document/dialogs/CreateDocumentDialog';
import EditDocumentDialog from '@/components/document/dialogs/EditDocumentDialog';
import { DeleteConfirmDialog } from '@/components/admin/DeleteConfirmDialog';
import { DocumentLoadingState } from '@/components/document/DocumentLoadingState';
import { DocumentEmptyState } from '@/components/document/DocumentEmptyState';
import { useDocumentsData } from './hooks/useDocumentsData';

const testData = [
  {
    id: 1,
    documentKey: 'DOC-001',
    title: 'Test Document 1',
    content: 'This is a test document.',
    docDate: '2023-01-01',
    status: 0,
    documentAlias: 'Test 1',
    isCircuitCompleted: false,
    documentType: {
      id: 1,
      typeName: 'Test Type',
    },
    createdBy: {
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'Admin',
    },
    createdAt: '2023-01-01',
    updatedAt: '2023-01-01',
    createdByUserId: 1,
  },
  {
    id: 2,
    documentKey: 'DOC-002',
    title: 'Test Document 2',
    content: 'This is another test document.',
    docDate: '2023-02-01',
    status: 1,
    documentAlias: 'Test 2',
    isCircuitCompleted: false,
    documentType: {
      id: 2,
      typeName: 'Another Type',
    },
    createdBy: {
      id: 1,
      username: 'testuser',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: 'Admin',
    },
    createdAt: '2023-02-01',
    updatedAt: '2023-02-01',
    createdByUserId: 1,
  },
];

export default function Documents() {
  const { user } = useAuth();
  const isSimpleUser = user?.role === 'SimpleUser';
  const [searchQuery, setSearchQuery] = useState('');
	const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const { documents, isLoading, isError, refetch } = useDocumentsData(searchQuery);

  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
    setEditDialogOpen(true);
  };

  const handleDelete = (document: Document) => {
    setSelectedDocument(document);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDocument) return;
    
    try {
      await documentService.deleteDocument(selectedDocument.id);
      toast.success("Document deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete document");
      console.error(error);
    }
  };

  if (isLoading) {
    return <DocumentLoadingState />;
  }

  if (isError) {
    return <div className="text-red-500 p-8">Error loading documents</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Documents</h1>
        <Input
          type="text"
          placeholder="Search documents..."
          className="max-w-md bg-gray-800 text-white border-gray-700 focus:border-blue-500 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Document
        </Button>
        {documents && documents.length > 0 && (
          <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700/50">
            {documents.length} {documents.length === 1 ? 'Document' : 'Documents'}
          </Badge>
        )}
      </div>

      <Card className="w-full shadow-md bg-[#111633]/70 border-blue-900/30">
        <CardHeader className="flex flex-row items-center justify-between border-b border-blue-900/30 bg-blue-900/20">
          <CardTitle className="text-xl text-blue-100">Document List</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {documents && documents.length > 0 ? (
            <div className="rounded-md">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-blue-900/30">
                    <TableHead className="text-blue-300">Title</TableHead>
                    <TableHead className="text-blue-300">Alias</TableHead>
                    <TableHead className="text-blue-300">Type</TableHead>
                    <TableHead className="text-blue-300">Status</TableHead>
                    <TableHead className="text-blue-300">Created By</TableHead>
                    <TableHead className="text-right text-blue-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((document) => (
                    <TableRow key={document.id} className="border-blue-900/30 hover:bg-blue-900/20 transition-colors">
                      <TableCell className="font-medium text-blue-100">{document.title}</TableCell>
                      <TableCell className="text-blue-100">{document.documentAlias}</TableCell>
                      <TableCell className="text-blue-100">{document.documentType.typeName}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{document.status}</Badge>
                      </TableCell>
                      <TableCell className="text-blue-100">{document.createdBy.firstName} {document.createdBy.lastName}</TableCell>
                      <TableCell className="text-right space-x-1">
                        <div className="flex justify-end gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost" 
                                size="icon"
                                className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/40"
                              >
                                {isSimpleUser ? <Info className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View details</TooltipContent>
                          </Tooltip>
                          
                          {!isSimpleUser && (
                            <>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-0 text-blue-400 hover:text-blue-300 hover:bg-blue-900/40"
                                    onClick={() => handleEdit(document)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit document</TooltipContent>
                              </Tooltip>

                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/30"
                                    onClick={() => handleDelete(document)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete document</TooltipContent>
                              </Tooltip>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <DocumentEmptyState searchQuery={searchQuery} isSimpleUser={isSimpleUser} />
          )}
        </CardContent>
      </Card>

      <CreateDocumentDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} onSuccess={refetch} />
      
      {selectedDocument && (
        <>
          <EditDocumentDialog
            document={selectedDocument}
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            onSuccess={refetch}
          />
          
          <DeleteConfirmDialog
            title="Delete Document"
            description={`Are you sure you want to delete the document "${selectedDocument.title}"? This action cannot be undone.`}
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            onConfirm={confirmDelete}
          />
        </>
      )}
    </div>
  );
}
