import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { File, Plus, Trash, Edit, LogOut, UserCog, Info } from 'lucide-react';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import documentService from '@/services/documentService';
import { Document } from '@/models/document';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';

const Documents = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocuments, setSelectedDocuments] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  // Check if user has permissions to create/edit/delete documents
  const canManageDocuments = user?.role === 'Admin' || user?.role === 'FullUser';

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const data = await documentService.getAllDocuments();
      setDocuments(data);
      setTotalPages(Math.ceil(data.length / pageSize));
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      toast.error('Failed to load documents');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout(navigate);
  };

  const handleSelectDocument = (id: number) => {
    if (!canManageDocuments) {
      toast.error('You do not have permission to select documents');
      return;
    }
    
    setSelectedDocuments(prev => {
      if (prev.includes(id)) {
        return prev.filter(docId => docId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleSelectAll = () => {
    if (!canManageDocuments) {
      toast.error('You do not have permission to select documents');
      return;
    }
    
    if (selectedDocuments.length === getPageDocuments().length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(getPageDocuments().map(doc => doc.id));
    }
  };

  const openDeleteDialog = (id?: number) => {
    if (!canManageDocuments) {
      toast.error('You do not have permission to delete documents');
      return;
    }
    
    if (id) {
      setDocumentToDelete(id);
    } else if (selectedDocuments.length > 0) {
      setDocumentToDelete(null);
    } else {
      return;
    }
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      if (documentToDelete) {
        await documentService.deleteDocument(documentToDelete);
        toast.success('Document deleted successfully');
      } else if (selectedDocuments.length > 0) {
        await documentService.deleteMultipleDocuments(selectedDocuments);
        toast.success(`${selectedDocuments.length} documents deleted successfully`);
        setSelectedDocuments([]);
      }
      fetchDocuments();
    } catch (error) {
      console.error('Failed to delete document(s):', error);
      toast.error('Failed to delete document(s)');
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  const getInitials = () => {
    return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;
  };

  const getPageDocuments = () => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return documents.slice(start, end);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard">
              <DocuVerseLogo className="h-10 w-auto" />
            </Link>
            <h1 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">DocApp</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && user.role === 'Admin' && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  Admin Panel
                </Button>
              </Link>
            )}
            <Link to="/profile">
              <div className="flex items-center space-x-3 cursor-pointer">
                <Avatar className="h-9 w-9">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt="Profile" />
                  ) : (
                    <AvatarFallback className="text-sm">{getInitials()}</AvatarFallback>
                  )}
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                    {user?.role && (
                      <Badge variant={user.role === "Admin" ? "success" : user.role === "FullUser" ? "info" : "outline"}>
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Documents</h1>
          <div className="flex space-x-3">
            {canManageDocuments ? (
              <Button className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/documents/create">
                  <Plus className="mr-2 h-4 w-4" /> New Document
                </Link>
              </Button>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700" disabled>
                      <Plus className="mr-2 h-4 w-4" /> New Document
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Only Admin or FullUser can create documents</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {canManageDocuments && selectedDocuments.length > 0 && (
              <Button variant="destructive" onClick={() => openDeleteDialog()}>
                <Trash className="mr-2 h-4 w-4" /> Delete Selected ({selectedDocuments.length})
              </Button>
            )}
          </div>
        </div>

        {/* Removed the warning message for SimpleUsers */}

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        ) : documents.length > 0 ? (
          <>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      {canManageDocuments ? (
                        <Checkbox 
                          checked={selectedDocuments.length === getPageDocuments().length && getPageDocuments().length > 0} 
                          onCheckedChange={handleSelectAll}
                        />
                      ) : (
                        <span>#</span>
                      )}
                    </TableHead>
                    <TableHead className="w-64">Document Key</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead className="w-24 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getPageDocuments().map((document, index) => (
                    <TableRow key={document.id}>
                      <TableCell>
                        {canManageDocuments ? (
                          <Checkbox 
                            checked={selectedDocuments.includes(document.id)}
                            onCheckedChange={() => handleSelectDocument(document.id)}
                          />
                        ) : (
                          <span className="text-sm text-gray-500">{index + 1 + (page - 1) * pageSize}</span>
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{document.documentKey}</TableCell>
                      <TableCell>
                        <Link to={`/documents/${document.id}`} className="text-blue-600 hover:underline">
                          {document.title}
                        </Link>
                      </TableCell>
                      <TableCell>{document.documentType.typeName}</TableCell>
                      <TableCell>{new Date(document.docDate).toLocaleDateString()}</TableCell>
                      <TableCell>{document.createdBy.username}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {canManageDocuments ? (
                            <>
                              <Button variant="ghost" size="icon" asChild>
                                <Link to={`/documents/${document.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => openDeleteDialog(document.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="icon" className="cursor-not-allowed opacity-50">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Only Admin or FullUser can edit documents</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {totalPages > 1 && (
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        onClick={() => setPage(i + 1)}
                        isActive={page === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <File className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">No documents found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {canManageDocuments 
                ? "Get started by creating your first document"
                : "No documents are available for viewing"}
            </p>
            <div className="mt-6">
              {canManageDocuments ? (
                <Button asChild>
                  <Link to="/documents/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Document
                  </Link>
                </Button>
              ) : (
                <Button disabled className="cursor-not-allowed opacity-60">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Document
                </Button>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              {documentToDelete 
                ? "Are you sure you want to delete this document? This action cannot be undone."
                : `Are you sure you want to delete ${selectedDocuments.length} selected documents? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;
