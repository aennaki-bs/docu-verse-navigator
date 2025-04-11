
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import documentService from "@/services/documentService";
import { Document } from "@/models/document";

export const useDocumentsData = (searchQuery: string = "") => {
  const [documents, setDocuments] = useState<Document[]>([]);

  const {
    data,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ["documents", searchQuery],
    queryFn: () => documentService.getAllDocuments(),
  });

  useEffect(() => {
    if (data) {
      let filteredDocs = data;
      
      if (searchQuery) {
        filteredDocs = data.filter(doc => 
          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
          doc.documentKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (doc.documentAlias && doc.documentAlias.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }
      
      setDocuments(filteredDocs);
    }
  }, [data, searchQuery]);

  const createDocument = async (newDocument: Omit<Document, "id">) => {
    try {
      await documentService.createDocument({
        title: newDocument.title,
        content: newDocument.content || "",
        docDate: newDocument.docDate,
        status: newDocument.status,
        typeId: newDocument.typeId,
      });
      toast.success("Document created successfully");
      refetch();
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Failed to create document");
    }
  };

  const updateDocument = async (id: number, updatedDocument: Document) => {
    try {
      await documentService.updateDocument(id, {
        title: updatedDocument.title,
        content: updatedDocument.content,
        docDate: updatedDocument.docDate,
        status: updatedDocument.status,
        typeId: updatedDocument.typeId,
      });
      toast.success("Document updated successfully");
      refetch();
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error("Failed to update document");
    }
  };

  const deleteDocument = async (id: number) => {
    try {
      await documentService.deleteDocument(id);
      toast.success("Document deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Failed to delete document");
    }
  };

  return {
    documents,
    isLoading,
    isError,
    refetch,
    createDocument,
    updateDocument,
    deleteDocument,
  };
};
