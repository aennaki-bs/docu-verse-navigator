
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  PlusCircle, 
  ChevronLeft, 
  FileText, 
  Layers, 
  ClipboardList,
  Calendar,
  User,
  Tag
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import documentService from '@/services/documentService';
import LignesList from '@/components/document/LignesList';
import { useAuth } from '@/context/AuthContext';

const DocumentLignesPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
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

  useEffect(() => {
    if (documentError) {
      toast.error('Failed to load document');
      navigate('/documents');
    }
    
    if (lignesError) {
      toast.error('Failed to load document lines');
    }
  }, [documentError, lignesError, navigate]);

  const getStatusBadge = (status: number) => {
    switch(status) {
      case 0:
        return <Badge variant="warning">Draft</Badge>;
      case 1:
        return <Badge variant="success">Active</Badge>;
      case 2:
        return <Badge variant="destructive">Archived</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  if (isLoadingDocument) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
          <div className="flex space-x-4">
            <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <div className="text-red-500 mb-4">
              <FileText className="h-12 w-12 mx-auto" />
            </div>
            <p className="text-lg text-gray-700 mb-4">Document not found or you don't have permission to view it.</p>
            <Button 
              variant="outline" 
              size="lg" 
              className="mt-4" 
              onClick={() => navigate('/documents')}
            >
              Return to Documents
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" size="sm" asChild className="group transition-all duration-200 hover:bg-primary hover:text-white">
            <Link to="/documents">
              <ChevronLeft className="h-4 w-4 mr-1 group-hover:transform group-hover:-translate-x-1 transition-transform" /> Back to Documents
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="group transition-all duration-200 hover:bg-secondary">
            <Link to={`/documents/${id}`} className="flex items-center">
              <FileText className="h-4 w-4 mr-1 group-hover:scale-110 transition-transform" /> View Document Details
            </Link>
          </Button>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl shadow-sm border border-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {document.title}
                </h1>
                {getStatusBadge(document.status)}
              </div>
              
              <div className="text-gray-600 flex items-center gap-1">
                <Tag className="h-4 w-4 text-blue-500" />
                <span className="font-mono text-sm">{document.documentKey}</span>
                <span className="mx-2">•</span>
                <span className="text-sm">{document.documentType.typeName}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(document.docDate).toLocaleDateString()}
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <User className="h-4 w-4 mr-1" />
                {document.createdBy.firstName} {document.createdBy.lastName}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <Layers className="h-5 w-5 mr-2" />
              Document Lines
            </CardTitle>
            <div className="flex items-center">
              <ClipboardList className="h-5 w-5 mr-1" />
              <span className="font-mono">{lignes.length} Lines</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoadingLignes ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4">
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
                <div className="h-12 bg-gray-200 rounded"></div>
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
    </div>
  );
};

export default DocumentLignesPage;
