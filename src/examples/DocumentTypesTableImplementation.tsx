import { useState } from "react";
import { DocumentTypesTable } from "@/components/types/DocumentTypesTable";

// Example document type data
interface DocType {
  id: number;
  typeCode: string;
  typeName: string;
  description: string;
  documentCount: number;
}

// Example of how to use the DocumentTypesTable
export function DocumentTypesTableImplementation() {
  const [documentTypes, setDocumentTypes] = useState<DocType[]>([
    {
      id: 1,
      typeCode: "FA",
      typeName: "Facture",
      description: "Facturation documents",
      documentCount: 5,
    },
    {
      id: 2,
      typeCode: "FI",
      typeName: "File",
      description: "General file type",
      documentCount: 0,
    },
  ]);

  // Handlers for document type operations
  const handleView = (docType: DocType) => {
    console.log("View document type details", docType);
  };

  const handleEdit = (docType: DocType) => {
    console.log("Edit document type", docType);
  };

  const handleDelete = (docType: DocType) => {
    console.log("Delete document type", docType);
  };

  return (
    <DocumentTypesTable
      documentTypes={documentTypes}
      onView={handleView}
      onEdit={handleEdit}
      onDelete={handleDelete}
      isSimpleUser={false}
    />
  );
}

// Example usage in a page:
/*
<DocumentTypesTable
  documentTypes={documentTypes}
  onView={handleViewType}
  onEdit={handleEditType}
  onDelete={handleDeleteType}
  isSimpleUser={false}
/>
*/
