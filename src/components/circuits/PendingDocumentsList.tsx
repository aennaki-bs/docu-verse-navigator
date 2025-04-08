
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Loader2, FileText, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import circuitService from '@/services/circuitService';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProcessCircuitStepDialog from './ProcessCircuitStepDialog';

export default function PendingDocumentsList() {
  const navigate = useNavigate();
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any | null>(null);

  const { 
    data: pendingDocuments, 
    isLoading, 
    isError, 
    refetch 
  } = useQuery({
    queryKey: ['pending-documents'],
    queryFn: circuitService.getPendingDocuments,
  });

  const handleProcess = (document: any) => {
    setSelectedDocument(document);
    setProcessDialogOpen(true);
  };

  const handleViewDocument = (documentId: number) => {
    navigate(`/documents/${documentId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-red-500">
        Failed to load pending documents
        <Button variant="outline" size="sm" className="ml-2" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  if (!pendingDocuments || pendingDocuments.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Documents Awaiting Your Action</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            You have no documents waiting for your approval
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Documents Awaiting Your Action</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Current Step</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingDocuments.map((document) => (
                <TableRow key={document.id}>
                  <TableCell className="font-medium">
                    {document.title}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{document.documentType?.name || 'Unknown'}</Badge>
                  </TableCell>
                  <TableCell>{document.createdBy?.username || 'Unknown'}</TableCell>
                  <TableCell>
                    {document.createdAt && format(new Date(document.createdAt), 'PP')}
                  </TableCell>
                  <TableCell>
                    <Badge>{document.currentCircuitDetail?.title || 'Unassigned'}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocument(document.id)}
                    >
                      <FileText className="mr-2 h-4 w-4" /> View
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleProcess(document)}
                    >
                      Process
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Process Dialog */}
      {selectedDocument && (
        <ProcessCircuitStepDialog
          documentId={selectedDocument.id}
          documentTitle={selectedDocument.title}
          currentStep={selectedDocument.currentCircuitDetail?.title || 'Unknown step'}
          open={processDialogOpen}
          onOpenChange={setProcessDialogOpen}
          onSuccess={refetch}
        />
      )}
    </Card>
  );
}
