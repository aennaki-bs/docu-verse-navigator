import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { PlusCircle, ChevronLeft, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
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

  if (isLoadingDocument) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-lg text-gray-500">Document not found.</p>
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
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/documents/${id}`}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to Document
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to={`/documents/${id}`} className="flex items-center">
              <FileText className="h-4 w-4 mr-1" /> View Document Details
            </Link>
          </Button>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{document.title}</h1>
            <p className="text-gray-500">{document.documentKey} - {document.documentType.typeName}</p>
          </div>
        </div>
      </div>

      <Separator className="my-6" />

      <Card>
        <CardHeader>
          <CardTitle>Document Lines</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingLignes ? (
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
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
