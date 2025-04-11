import { Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Document, DocumentType } from '@/models/document';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentColumn } from '@/components/document/DocumentColumn';
import AddToCircuitButton from '@/components/circuits/AddToCircuitButton';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { RefetchOptions } from '@tanstack/react-query';

interface DocumentsTableColumnsProps {
  handleEditDocument: (id: number) => void;
  handleViewDocumentFlow: (id: number) => void;
  openDeleteDialog: (document: Document) => void;
  refetchDocuments: () => void;
}

export function DocumentsTableColumns({
  handleEditDocument,
  handleViewDocumentFlow,
  openDeleteDialog,
  refetchDocuments
}: DocumentsTableColumnsProps) {
  
  const columns: DocumentColumn<Document>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting?.(column.getIsSorted() === "asc")}
          >
            Title
            {column.getIsSorted() === "asc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        );
      },
      cell: ({ row }) => {
        if (!row.original) return null;
        return (
          <div className="flex items-center">
            {row.original.title}
          </div>
        );
      },
    },
    {
      accessorKey: 'documentType.typeName',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting?.(column.getIsSorted() === "asc")}
          >
            Type
            {column.getIsSorted() === "asc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        );
      },
      cell: ({ row }) => {
        // Add safety check for documentType
        if (!row.original || !row.original.documentType) {
          return <Badge variant="outline">Unknown</Badge>;
        }
        return <Badge variant="secondary">{row.original.documentType.typeName}</Badge>;
      },
    },
    {
      accessorKey: 'docDate',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting?.(column.getIsSorted() === "asc")}
          >
            Date
            {column.getIsSorted() === "asc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        );
      },
      cell: ({ row }) => {
        if (!row.original || !row.original.docDate) {
          return "N/A";
        }
        return new Date(row.original.docDate).toLocaleDateString();
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting?.(column.getIsSorted() === "asc")}
          >
            Status
            {column.getIsSorted() === "asc" ? (
              <ArrowDown className="ml-2 h-4 w-4" />
            ) : column.getIsSorted() === "desc" ? (
              <ArrowUp className="ml-2 h-4 w-4" />
            ) : null}
          </Button>
        );
      },
      cell: ({ row }) => {
        if (!row.original) {
          return <Badge variant="outline">Unknown</Badge>;
        }
      
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
      cell: ({ row }) => {
        if (!row.original) {
          return null;
        }
        
        return (
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
              <DropdownMenuItem onClick={() => openDeleteDialog(row.original)}>
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
        );
      },
    },
  ];
  
  return columns;
}
