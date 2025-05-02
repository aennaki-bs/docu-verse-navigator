import { Pencil, Trash2, Eye, Download, Archive, Share2 } from "lucide-react";
import { Column, Action, BulkAction } from "@/components/table/DataTable";
import { createDataTable } from "@/components/table/create-data-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Document {
  id: number;
  documentCode: string;
  title: string;
  type: string;
  status: string;
  date: Date;
  createdBy: {
    id: number;
    initials: string;
    name: string;
    avatar?: string;
  };
}

// Create a typed DataTable for Document
const DocumentTable = createDataTable<Document>();

interface DocumentsTableProps {
  documents: Document[];
  onEdit?: (doc: Document) => void;
  onDelete?: (doc: Document) => void;
  onView?: (doc: Document) => void;
  onDownload?: (doc: Document) => void;
  onArchive?: (doc: Document) => void;
  onShare?: (doc: Document) => void;
  isSimpleUser?: boolean;
}

export function DocumentsTable({
  documents,
  onEdit,
  onDelete,
  onView,
  onDownload,
  onArchive,
  onShare,
  isSimpleUser = false,
}: DocumentsTableProps) {
  // Define columns
  const columns: Column<Document>[] = [
    {
      header: "Document Code",
      key: "documentCode",
      cell: (doc) => (
        <Link
          to={`/documents/${doc.id}`}
          className="hover:underline flex items-center"
        >
          <span className="font-mono text-xs px-2.5 py-1 rounded-md bg-blue-100/70 border border-blue-200/60 text-blue-700">
            {doc.documentCode}
          </span>
        </Link>
      ),
    },
    {
      header: "Title",
      key: "title",
      cell: (doc) => (
        <Link
          to={`/documents/${doc.id}`}
          className="hover:underline font-medium"
        >
          {doc.title}
        </Link>
      ),
    },
    {
      header: "Type",
      key: "type",
      cell: (doc) => (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-700 border-blue-200"
        >
          {doc.type}
        </Badge>
      ),
    },
    {
      header: "Status",
      key: "status",
      cell: (doc) => (
        <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200">
          {doc.status}
        </Badge>
      ),
    },
    {
      header: "Document Date",
      key: "date",
      cell: (doc) => (
        <span className="text-muted-foreground text-sm">
          {format(doc.date, "MM/dd/yyyy")}
        </span>
      ),
    },
    {
      header: "Created By",
      key: "createdBy",
      cell: (doc) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {doc.createdBy.avatar && (
              <AvatarImage
                src={doc.createdBy.avatar}
                alt={doc.createdBy.name}
              />
            )}
            <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
              {doc.createdBy.initials}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm">{doc.createdBy.name}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      width: "w-20",
    },
  ];

  // Define row actions
  const tableActions: Action<Document>[] = [
    {
      label: "View Document",
      icon: <Eye className="h-4 w-4 mr-2" />,
      onClick: onView || (() => {}),
      color: "blue",
      show: () => !!onView,
    },
    {
      label: "Download",
      icon: <Download className="h-4 w-4 mr-2" />,
      onClick: onDownload || (() => {}),
      color: "green",
      show: () => !!onDownload,
    },
    {
      label: "Share",
      icon: <Share2 className="h-4 w-4 mr-2" />,
      onClick: onShare || (() => {}),
      color: "indigo",
      show: () => !!onShare,
    },
    {
      label: "Edit Document",
      icon: <Pencil className="h-4 w-4 mr-2" />,
      onClick: onEdit || (() => {}),
      color: "amber",
      show: () => !isSimpleUser && !!onEdit,
    },
    {
      label: "Archive",
      icon: <Archive className="h-4 w-4 mr-2" />,
      onClick: onArchive || (() => {}),
      color: "purple",
      show: () => !isSimpleUser && !!onArchive,
    },
    {
      label: "Delete Document",
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      onClick: onDelete || (() => {}),
      color: "red",
      show: () => !isSimpleUser && !!onDelete,
    },
  ];

  // Define bulk actions
  const bulkActions: BulkAction[] = !isSimpleUser
    ? [
        {
          label: "Archive",
          icon: <Archive className="h-3.5 w-3.5 mr-1.5" />,
          onClick: (ids) => console.log("Archive documents", ids),
          color: "blue",
        },
        {
          label: "Download",
          icon: <Download className="h-3.5 w-3.5 mr-1.5" />,
          onClick: (ids) => console.log("Download documents", ids),
          color: "green",
        },
        {
          label: "Share",
          icon: <Share2 className="h-3.5 w-3.5 mr-1.5" />,
          onClick: (ids) => console.log("Share documents", ids),
          color: "indigo",
        },
        {
          label: "Delete Selected",
          icon: <Trash2 className="h-3.5 w-3.5 mr-1.5" />,
          onClick: (ids) => console.log("Delete documents", ids),
          color: "red",
        },
      ]
    : [];

  return (
    <DocumentTable
      data={documents}
      columns={columns}
      getRowId={(doc) => doc.id}
      actions={tableActions}
      bulkActions={bulkActions}
      isSimpleUser={isSimpleUser}
    />
  );
}
