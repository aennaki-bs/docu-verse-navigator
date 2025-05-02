import { useState } from "react";
import { DocumentsTable } from "@/components/documents/DocumentsTable";

// Example document data
interface DocumentItem {
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

// Example of how to use the DocumentsTable
export function DocumentsTableImplementation() {
  const [documents, setDocuments] = useState<DocumentItem[]>([
    {
      id: 1,
      documentCode: "FADM-0001",
      title: "Docmm",
      type: "Facture",
      status: "In progress",
      date: new Date("2025-04-22"),
      createdBy: {
        id: 1,
        initials: "MM",
        name: "mamounib",
      },
    },
    {
      id: 2,
      documentCode: "FAD-0002",
      title: "New document",
      type: "Facture",
      status: "In progress",
      date: new Date("2025-01-29"),
      createdBy: {
        id: 2,
        initials: "AH",
        name: "aennaki",
      },
    },
  ]);

  // Handlers for document operations
  const handleView = (doc: DocumentItem) => {
    console.log("View document", doc);
  };

  const handleEdit = (doc: DocumentItem) => {
    console.log("Edit document", doc);
  };

  const handleDelete = (doc: DocumentItem) => {
    console.log("Delete document", doc);
  };

  const handleDownload = (doc: DocumentItem) => {
    console.log("Download document", doc);
  };

  const handleArchive = (doc: DocumentItem) => {
    console.log("Archive document", doc);
  };

  const handleShare = (doc: DocumentItem) => {
    console.log("Share document", doc);
  };

  return (
    <DocumentsTable
      documents={documents}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      onDownload={handleDownload}
      onArchive={handleArchive}
      onShare={handleShare}
      isSimpleUser={false}
    />
  );
}

// Example usage in a page:
/*
<DocumentsTable
  documents={documents}
  onView={handleViewDocument}
  onEdit={handleEditDocument}
  onDelete={handleDeleteDocument}
  onDownload={handleDownloadDocument}
  onArchive={handleArchiveDocument}
  onShare={handleShareDocument}
  isSimpleUser={false}
/>
*/
