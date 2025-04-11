
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
import { 
  Edit, 
  LogOut, 
  UserCog, 
  Trash, 
  ArrowLeft, 
  FileText, 
  Layers,
  AlertCircle,
  Ban,
  Calendar,
  Clock,
  User
} from 'lucide-react';
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
import { motion } from 'framer-motion';

const ViewDocument = () => {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Check if user has permissions to edit/delete documents
  const canManageDocuments = user?.role === 'Admin' || user?.role === 'FullUser';

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

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
        return <Badge className="bg-amber-500/20 text-amber-200 hover:bg-amber-500/30 border-amber-500/30">Draft</Badge>;
      case 1:
        return <Badge className="bg-green-500/20 text-green-200 hover:bg-green-500/30 border-green-500/30">Active</Badge>;
      case 2:
        return <Badge className="bg-purple-500/20 text-purple-200 hover:bg-purple-500/30 border-purple-500/30">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

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

  if (!id) {
    navigate('/documents');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900/20 to-blue-950/30">
      {/* Header */}
      {/* <header className="bg-gradient-to-r from-gray-900/95 to-blue-900/95 border-b border-white/10 backdrop-blur-md shadow-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/dashboard" className="flex items-center">
              <DocuVerseLogo className="h-10 w-auto" />
            </Link>
            <div className="hidden md:block h-6 w-px bg-gray-700"></div>
            <h1 className="ml-2 text-xl font-semibold text-white hidden md:block">DocApp</h1>
          </div>
          <div className="flex items-center space-x-4">
            {user && user.role === 'Admin' && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="border-blue-400/30 text-blue-300 hover:text-white hover:bg-blue-700/50 flex items-center gap-2">
                  <UserCog className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin Panel</span>
                </Button>
              </Link>
            )}
            <Link to="/profile">
              <div className="flex items-center space-x-3 cursor-pointer">
                <Avatar className="h-9 w-9 border border-white/20">
                  {user?.profilePicture ? (
                    <AvatarImage src={user.profilePicture} alt="Profile" />
                  ) : (
                    <AvatarFallback className="text-sm bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                      {getInitials()}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-right hidden md:block">
                  <p className="text-sm font-medium text-white">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-blue-300">{user?.email}</p>
                    {user?.role && (
                      <Badge className={user.role === "Admin" 
                        ? "bg-green-500/20 text-green-200 border-green-500/30" 
                        : user.role === "FullUser" 
                          ? "bg-blue-500/20 text-blue-200 border-blue-500/30"
                          : "bg-gray-500/20 text-gray-200 border-gray-500/30"
                      }>
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Link>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-blue-300 hover:text-white hover:bg-blue-800/50">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header> */}

      {/* Main Content */}
      <motion.main 
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                {isLoadingDocument ? 'Loading...' : document?.title}
                {document && getStatusBadge(document.status)}
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
          
          {document && canManageDocuments && (
            <div className="flex space-x-3">
              <Button variant="outline" className="border-blue-400/30 text-blue-300 hover:text-white hover:bg-blue-700/50 flex items-center gap-2" asChild>
                <Link to={`/documents/${document.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" /> Edit
                </Link>
              </Button>
              <Button 
                variant="destructive" 
                className="bg-red-600/80 hover:bg-red-700/80 flex items-center gap-2"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash className="h-4 w-4 mr-2" /> Delete
              </Button>
            </div>
          )}
          
          {document && !canManageDocuments && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button variant="outline" className="border-blue-400/30 text-blue-300 opacity-60 cursor-not-allowed flex items-center gap-2" disabled>
                      <Edit className="h-4 w-4 mr-2" /> Edit
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-gray-900 border-blue-500/30 text-blue-300">
                  <p>Only Admin or FullUser can edit documents</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </motion.div>

        {isLoadingDocument ? (
          <motion.div variants={itemVariants} className="space-y-6">
            <Card className="animate-pulse bg-gradient-to-br from-gray-900/90 to-blue-900/60 border-blue-500/20">
              <CardHeader className="h-12 bg-blue-900/30"></CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="h-6 bg-blue-900/40 rounded-md"></div>
                  <div className="h-6 bg-blue-900/40 rounded-md w-3/4"></div>
                  <div className="h-40 bg-blue-900/40 rounded-md"></div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : document ? (
          <>
            <motion.div variants={itemVariants} className="mb-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-white/5 backdrop-blur-md border border-white/10 w-full grid grid-cols-2 p-1 h-auto">
                  <TabsTrigger 
                    value="details" 
                    className="py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-indigo-600/80 data-[state=active]:text-white"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Document Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="lignes"
                    className="py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600/80 data-[state=active]:to-indigo-600/80 data-[state=active]:text-white"
                  >
                    <Layers className="h-4 w-4 mr-2" />
                    Lines
                    <Badge variant="secondary" className="ml-2 bg-blue-900/50 text-blue-200">{document.lignesCount || lignes.length}</Badge>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-0">
                  <Card className={`overflow-hidden border-l-4 bg-gradient-to-br ${getStatusClass(document.status)} shadow-xl`}>
                    <CardHeader className="bg-gradient-to-r from-blue-800/30 to-indigo-800/20 border-b border-white/5">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl text-white flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-300" />
                          Document Details
                        </CardTitle>
                        <p className="text-sm text-blue-300/80 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          Last updated: {new Date(document.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 text-blue-100">
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h3 className="text-sm font-medium text-blue-300 mb-1">Document Type</h3>
                          <p className="font-medium">{document.documentType.typeName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-300 mb-1">Document Date</h3>
                          <p className="font-medium flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-blue-400" />
                            {new Date(document.docDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-300 mb-1">Created By</h3>
                          <p className="font-medium flex items-center gap-1">
                            <User className="h-4 w-4 text-blue-400" />
                            {document.createdBy.firstName} {document.createdBy.lastName}
                          </p>
                          <p className="text-sm text-blue-300/70">({document.createdBy.username})</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-blue-300 mb-1">Created At</h3>
                          <p className="font-medium flex items-center gap-1">
                            <Clock className="h-4 w-4 text-blue-400" />
                            {new Date(document.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      
                      <Separator className="my-6 bg-blue-400/20" />
                      
                      <div>
                        <h3 className="text-sm font-medium text-blue-300 mb-3">Content</h3>
                        <div className="p-4 bg-blue-950/40 rounded-md min-h-[200px] whitespace-pre-wrap border border-blue-400/20">
                          {document.content || "No content available."}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="lignes" className="mt-0">
                  <Card className="overflow-hidden border-none shadow-xl bg-transparent">
                    <CardHeader className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center">
                          <Layers className="h-5 w-5 mr-2 text-blue-200" />
                          Document Lines
                        </CardTitle>
                        <Link to={`/documents/${document.id}/lignes`} className="flex items-center bg-blue-900/40 px-3 py-1.5 rounded-full border border-blue-300/30 text-sm hover:bg-blue-900/60 transition-colors">
                          View full lines page
                        </Link>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      {isLoadingLignes ? (
                        <div className="p-8 bg-blue-950/30">
                          <div className="animate-pulse space-y-4">
                            <div className="h-14 bg-blue-900/50 rounded-md"></div>
                            <div className="h-14 bg-blue-900/50 rounded-md"></div>
                            <div className="h-14 bg-blue-900/50 rounded-md"></div>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-gradient-to-br from-gray-900/95 to-blue-900/70 backdrop-blur-sm max-h-[60vh] overflow-auto">
                          <LignesList
                            document={document}
                            lignes={lignes}
                            canManageDocuments={canManageDocuments}
                            isCreateDialogOpen={isCreateDialogOpen}
                            setIsCreateDialogOpen={setIsCreateDialogOpen}
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </>
        ) : (
          <motion.div variants={itemVariants}>
            <Card className="border-red-400/20 bg-gradient-to-br from-red-900/10 to-red-800/5 backdrop-blur-sm shadow-xl">
              <CardContent className="p-8 text-center">
                <div className="text-red-400 mb-4">
                  <FileText className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Document Not Found</h3>
                <p className="text-lg text-gray-400 mb-6">
                  Document not found or you don't have permission to view it.
                </p>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="mt-4 border-blue-400/30 text-blue-300 hover:text-white hover:bg-blue-700/50" 
                  onClick={() => navigate('/documents')}
                >
                  Return to Documents
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.main>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-gradient-to-br from-gray-900/95 to-red-900/80 border-white/10 text-white shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center text-red-300">
              <AlertCircle className="h-5 w-5 mr-2" /> Confirm Delete
            </DialogTitle>
            <DialogDescription className="text-gray-300">
              Are you sure you want to delete this document? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setDeleteDialogOpen(false)}
              className="border-gray-400/30 text-gray-300 hover:text-white hover:bg-gray-700/50"
            >
              <Ban className="h-4 w-4 mr-2" /> Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
            >
              <Trash className="h-4 w-4 mr-2" /> Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewDocument;
