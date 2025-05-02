import { Pencil, Trash2, Eye, FileText } from "lucide-react";
import { Column, Action, BulkAction } from "@/components/table/DataTable";
import { createDataTable } from "@/components/table/create-data-table";
import { Badge } from "@/components/ui/badge";

interface DocumentType {
  id: number;
  typeCode: string;
  typeName: string;
  description: string;
  documentCount: number;
}

// Create a typed DataTable for DocumentType
const DocumentTypeTable = createDataTable<DocumentType>();

interface DocumentTypesTableProps {
  documentTypes: DocumentType[];
  onEdit?: (docType: DocumentType) => void;
  onDelete?: (docType: DocumentType) => void;
  onView?: (docType: DocumentType) => void;
  isSimpleUser?: boolean;
}

export function DocumentTypesTable({
  documentTypes,
  onEdit,
  onDelete,
  onView,
  isSimpleUser = false,
}: DocumentTypesTableProps) {
  // Define columns
  const columns: Column<DocumentType>[] = [
    {
      header: "Type Code",
      key: "typeCode",
      cell: (item) => (
        <span className="font-mono text-xs font-medium px-2.5 py-1 rounded-md bg-blue-100/70 border border-blue-200/60 text-blue-700">
          {item.typeCode}
        </span>
      ),
    },
    {
      header: "Type Name",
      key: "typeName",
      cell: (item) => <span className="font-medium">{item.typeName}</span>,
    },
    {
      header: "Description",
      key: "description",
      cell: (item) => (
        <span className="text-muted-foreground max-w-md truncate block">
          {item.description || "No description"}
        </span>
      ),
    },
    {
      header: "Document Count",
      key: "documentCount",
      cell: (item) => (
        <Badge
          variant="outline"
          className={
            item.documentCount > 0
              ? "bg-indigo-100 border-indigo-300 text-indigo-700"
              : "bg-gray-100 border-gray-300 text-gray-700"
          }
        >
          {item.documentCount}
        </Badge>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      width: "w-20",
    },
  ];

  // Define row actions
  const tableActions: Action<DocumentType>[] = [
    {
      label: "View Details",
      icon: <Eye className="h-4 w-4 mr-2" />,
      onClick: onView || (() => {}),
      color: "blue",
      show: () => !!onView,
    },
    {
      label: "View Documents",
      icon: <FileText className="h-4 w-4 mr-2" />,
      onClick: (docType) => console.log("View documents of type", docType),
      color: "indigo",
    },
    {
      label: "Edit Type",
      icon: <Pencil className="h-4 w-4 mr-2" />,
      onClick: onEdit || (() => {}),
      color: "amber",
      show: () => !isSimpleUser && !!onEdit,
    },
    {
      label: "Delete Type",
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      onClick: onDelete || (() => {}),
      color: "red",
      show: (docType) =>
        !isSimpleUser && !!onDelete && docType.documentCount === 0,
    },
  ];

  // Define bulk actions
  const bulkActions: BulkAction[] = !isSimpleUser
    ? [
        {
          label: "Delete Selected",
          icon: <Trash2 className="h-3.5 w-3.5 mr-1.5" />,
          onClick: (ids) => console.log("Delete document types", ids),
          color: "red",
        },
      ]
    : [];

  return (
    <DocumentTypeTable
      data={documentTypes}
      columns={columns}
      getRowId={(item) => item.id}
      actions={tableActions}
      bulkActions={bulkActions}
      isSimpleUser={isSimpleUser}
    />
  );
}
