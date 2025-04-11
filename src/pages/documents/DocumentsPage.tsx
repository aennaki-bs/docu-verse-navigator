import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus, Edit, Trash2, FileText, Search, ArrowDown, ArrowUp } from 'lucide-react';
import { toast } from 'sonner';
import documentService from '@/services/documentService';
import { Document } from '@/models/document';
import { DataTable } from "@/components/ui/data-table"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DocumentType } from '@/models/document';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { confirm } from '@/components/ui/confirm-dialog';
import { DocumentColumn } from '@/components/document/DocumentColumn';
import AddToCircuitButton from '@/components/circuits/AddToCircuitButton';

interface SortConfig {
  key: string;
  direction: "ascending" | "descending";
}

const DocumentsPage = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [search, setSearch] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);

  const { data: documentsData, isLoading: isLoadingDocuments, refetch: refetchDocuments } = useQuery({
    queryKey: ['documents', search, sortConfig],
    queryFn: () => documentService.getAllDocuments(),
  });

  const { data: documentTypesData, isLoading: isLoadingDocumentTypes } = useQuery({
    queryKey: ['documentTypes'],
    queryFn: () => documentService.getAllDocumentTypes(),
  });

  useEffect(() => {
    if (documentsData) {
      setDocuments(documentsData);
    }
  }, [documentsData]);

  useEffect(() => {
    if (documentTypesData) {
      setDocumentTypes(documentTypesData);
    }
  }, [documentTypesData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleCreateDocument = () => {
    setIsCreating(true);
    navigate('/documents/create');
  };

  const handleEditDocument = (id: number) => {
    navigate(`/documents/${id}/edit`);
  };

  const handleDeleteDocument = async (document: Document) => {
    const confirmed = await confirm({
      title: 'Delete Document',
      description: `Are you sure you want to delete document "${document.title}"? This action cannot be undone.`,
    });

    if (!confirmed) {
      return;
    }

    try {
      await documentService.deleteDocument(document.id);
      toast.success(`Document "${document.title}" deleted successfully`);
      refetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('Failed to delete document');
    }
  };

  const handleViewDocumentFlow = (id: number) => {
    navigate(`/document-flow/${id}`);
  };

  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    
    setSortConfig({ key, direction });
  };

  const columns: DocumentColumn<Document>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => requestSort('title')}
          >
            Title
            {sortConfig?.key === 'title' && sortConfig?.direction === 'ascending' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : sortConfig?.key === 'title' && sortConfig?.direction === 'descending' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center">
          {row.original.title}
        </div>
      ),
    },
    {
      accessorKey: 'documentType.typeName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => requestSort('documentType.typeName')}
          >
            Type
            {sortConfig?.key === 'documentType.typeName' && sortConfig?.direction === 'ascending' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : sortConfig?.key === 'documentType.typeName' && sortConfig?.direction === 'descending' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => (
        <Badge variant="secondary">{row.original.documentType.typeName}</Badge>
      ),
    },
    {
      accessorKey: 'docDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => requestSort('docDate')}
          >
            Date
            {sortConfig?.key === 'docDate' && sortConfig?.direction === 'ascending' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : sortConfig?.key === 'docDate' && sortConfig?.direction === 'descending' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => new Date(row.original.docDate).toLocaleDateString(),
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => requestSort('status')}
          >
            Status
            {sortConfig?.key === 'status' && sortConfig?.direction === 'ascending' ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : sortConfig?.key === 'status' && sortConfig?.direction === 'descending' ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        )
      },
      cell: ({ row }) => {
        let statusText = 'Unknown';
        let badgeVariant: "default" | "secondary" | "outline" | "destructive" = "default";

        switch (row.original.status) {
          case 0:
            statusText = 'Draft';
            badgeVariant = "outline";
            break;
          case 1:
            statusText = 'In Progress';
            badgeVariant = "secondary";
            break;
          case 2:
            statusText = 'Completed';
            badgeVariant = "default";
            break;
          case 3:
            statusText = 'Rejected';
            badgeVariant = "destructive";
            break;
          default:
            break;
        }

        return <Badge variant={badgeVariant}>{statusText}</Badge>;
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleEditDocument(row.original.id)}>
              <Edit className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleViewDocumentFlow(row.original.id)}>
              <FileText className="mr-2 h-4 w-4" /> View Flow
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteDocument(row.original)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <AddToCircuitButton
                documentId={row.original.id}
                documentTitle={row.original.title}
                onSuccess={refetchDocuments}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold">Documents</h1>
        <Button onClick={handleCreateDocument} disabled={isCreating}>
          <Plus className="mr-2 h-4 w-4" />
          Create Document
        </Button>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search documents..."
          value={search}
          onChange={handleSearchChange}
          className="w-full max-w-md"
        />
      </div>

      {documents && (
        <div className="rounded-md border">
          <DataTable columns={columns} data={documents} />
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
