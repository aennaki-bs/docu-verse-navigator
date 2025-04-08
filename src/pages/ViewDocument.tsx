
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Edit, LogOut, UserCog, Trash, ArrowLeft } from 'lucide-react';
import DocuVerseLogo from '@/components/DocuVerseLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import documentService from '@/services/documentService';
import { Document, Ligne } from '@/models/document';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from '@tanstack/react-query';
import LignesList from '@/components/document/LignesList';

const ViewDocument = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  // Check if user has permissions to edit/delete documents
  const canManageDocuments = user?.role === 'Admin' || user?.role === 'FullUser';

  // Fetch document details
  const { 
    data: document, 
    isLoading: isLoadingDocument, 
    error: documentError 
  } = useQuery({
    queryKey: ['document', Number(id)],
    queryFn: () => documentService.getDocumentById(Number(id)),
    enabled: !!id
  });

  // Fetch lignes for this document
  const {
    data: lignes = [],
    isLoading: isLoadingLignes,
    error: lignesError
  } = useQuery({
    queryKey: ['documentLignes', Number(id)],
    queryFn: () => documentService.getLignesByDocumentId(Number(id)),
    enabled: !!id
  });

  // Handle errors from queries using useEffect
  useEffect(() => {
    if (documentError) {
      console.error(`Failed to fetch document with ID ${id}:`, documentError);
      toast.error('Failed to load document');
      navigate('/documents');
    }

    if (lignesError) {
      console.error(`Failed to fetch lignes for document ${id}:`, lignesError);
      toast.error('Failed to load document lignes');
    }
  }, [documentError, lignesError, id, navigate]);

  const handleLogout = () => {
    logout(navigate);
  };

  const handleDelete = async () => {
    if (!canManageDocuments) {
      toast.error('You do not have permission to delete documents');
      return;
    }
    
    try {
      if (document) {
        await documentService.deleteDocument(document.id);
        toast.success('Document deleted successfully');
        navigate('/documents');
      }
    } catch (error) {
      console.error('Failed to delete document:', error);
      toast.error('Failed to delete document');
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  const getInitials = () => {
    return `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`;
  };
  
  const getStatusBadge = (status: number) => {
    switch(status) {
      case 0:
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Draft</span>;
      case 1:
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Active</span>;
      case 2:
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Archived</span>;
      default:
        return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Unknown</span>;
    }
  };

  const getStatusClass = (status: number) => {
    switch(status) {
      case 0:
        return 'border-l-amber-400 bg-gradient-amber';
      case 1:
        return 'border-l-green-500 bg-gradient-green';
      case 2:
        return 'border-l-red-400 bg-gradient-purple';
      default:
        return 'border-l-blue-500 bg-gradient-blue';
    }
  };

  if (!id) {
    navigate('/documents');
    return null;
  }

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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Button variant="outline" size="sm" onClick={() => navigate('/documents')} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-1" /> Back to Documents
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isLoadingDocument ? 'Loading...' : document?.title}
            </h1>
          </div>
          
          {document && (
            <div className="flex space-x-3">
              {canManageDocuments ? (
                <>
                  <Button variant="outline" className="flex items-center" asChild>
                    <Link to={`/documents/${document.id}/edit`}>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Link>
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="flex items-center"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash className="h-4 w-4 mr-2" /> Delete
                  </Button>
                </>
              ) : (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button variant="outline" className="flex items-center" disabled>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Only Admin or FullUser can edit documents</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          )}
        </div>

        {isLoadingDocument ? (
          <div className="space-y-4">
            <Card className="animate-pulse">
              <CardHeader className="h-10 bg-gray-200 dark:bg-gray-700"></CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : document ? (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="details" className="text-base">Document Details</TabsTrigger>
                <TabsTrigger value="lignes" className="text-base">
                  Lignes
                  {document.lignesCount !== undefined && (
                    <Badge variant="secondary" className="ml-2">{document.lignesCount}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-0">
                <Card className={`overflow-hidden border-l-4 ${getStatusClass(document.status)}`}>
                  <CardHeader className="bg-gray-100 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl flex items-center gap-2">
                        {document.documentKey}
                        {getStatusBadge(document.status)}
                      </CardTitle>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Last updated: {new Date(document.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Document Type</h3>
                        <p className="font-medium">{document.documentType.typeName}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Document Date</h3>
                        <p className="font-medium">{new Date(document.docDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created By</h3>
                        <p className="font-medium">{document.createdBy.firstName} {document.createdBy.lastName} ({document.createdBy.username})</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Created At</h3>
                        <p className="font-medium">{new Date(document.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Content</h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800/30 rounded-md min-h-[200px] whitespace-pre-wrap border border-gray-200 dark:border-gray-700">
                        {document.content}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="lignes" className="mt-0">
                <Card className="border-none shadow-lg">
                  <CardContent className="p-0">
                    {isLoadingLignes ? (
                      <div className="p-8">
                        <div className="animate-pulse space-y-4">
                          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                      </div>
                    ) : (
                      <LignesList
                        document={document}
                        lignes={lignes}
                        canManageDocuments={canManageDocuments}
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <p>Document not found or you don't have permission to view it.</p>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
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

export default ViewDocument;
