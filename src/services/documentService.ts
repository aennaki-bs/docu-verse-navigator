
import api from './api';
import { Document, DocumentType, CreateDocumentRequest, UpdateDocumentRequest, 
         Ligne, CreateLigneRequest, UpdateLigneRequest,
         SousLigne, CreateSousLigneRequest, UpdateSousLigneRequest } from '../models/document';

const documentService = {
  // Document methods
  getAllDocuments: async (): Promise<Document[]> => {
    try {
      const response = await api.get('/Documents');
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  },

  getDocumentById: async (id: number): Promise<Document> => {
    try {
      const response = await api.get(`/Documents/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching document with ID ${id}:`, error);
      throw error;
    }
  },

  getRecentDocuments: async (limit: number = 5): Promise<Document[]> => {
    try {
      const response = await api.get(`/Documents/recent?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent documents:', error);
      // If the API doesn't have this endpoint yet, fall back to getting all documents and sorting them
      const allDocs = await documentService.getAllDocuments();
      return allDocs
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, limit);
    }
  },

  createDocument: async (document: CreateDocumentRequest): Promise<Document> => {
    try {
      const response = await api.post('/Documents', document);
      return response.data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  },

  updateDocument: async (id: number, document: UpdateDocumentRequest): Promise<void> => {
    try {
      await api.put(`/Documents/${id}`, document);
    } catch (error) {
      console.error(`Error updating document with ID ${id}:`, error);
      throw error;
    }
  },

  deleteDocument: async (id: number): Promise<void> => {
    try {
      await api.delete(`/Documents/${id}`);
    } catch (error) {
      console.error(`Error deleting document with ID ${id}:`, error);
      throw error;
    }
  },

  deleteMultipleDocuments: async (ids: number[]): Promise<void> => {
    try {
      // Since the API doesn't support bulk deletion, we'll delete one by one
      await Promise.all(ids.map(id => api.delete(`/Documents/${id}`)));
    } catch (error) {
      console.error('Error deleting multiple documents:', error);
      throw error;
    }
  },

  // Document Types methods
  getAllDocumentTypes: async (): Promise<DocumentType[]> => {
    try {
      const response = await api.get('/Documents/Types');
      return response.data;
    } catch (error) {
      console.error('Error fetching document types:', error);
      throw error;
    }
  },

  createDocumentType: async (documentType: DocumentType): Promise<void> => {
    try {
      await api.post('/Documents/Types', documentType);
    } catch (error) {
      console.error('Error creating document type:', error);
      throw error;
    }
  },

  updateDocumentType: async (id: number, documentType: DocumentType): Promise<void> => {
    try {
      await api.put(`/Documents/Types/${id}`, documentType);
    } catch (error) {
      console.error(`Error updating document type with ID ${id}:`, error);
      throw error;
    }
  },

  validateTypeName: async (typeName: string): Promise<boolean> => {
    try {
      const response = await api.post('/Documents/valide-type', { typeName });
      return response.data === "True";
    } catch (error) {
      console.error('Error validating type name:', error);
      throw error;
    }
  },

  deleteDocumentType: async (id: number): Promise<void> => {
    try {
      await api.delete(`/Documents/Types/${id}`);
    } catch (error) {
      console.error(`Error deleting document type with ID ${id}:`, error);
      throw error;
    }
  },
  
  // New method for bulk deletion of document types
  deleteMultipleDocumentTypes: async (ids: number[]): Promise<void> => {
    try {
      // Since the API doesn't support bulk deletion, we'll delete one by one
      await Promise.all(ids.map(id => api.delete(`/Documents/Types/${id}`)));
    } catch (error) {
      console.error('Error deleting multiple document types:', error);
      throw error;
    }
  },

  // Ligne methods
  getAllLignes: async (): Promise<Ligne[]> => {
    try {
      const response = await api.get('/Lignes');
      return response.data;
    } catch (error) {
      console.error('Error fetching lignes:', error);
      throw error;
    }
  },

  getLigneById: async (id: number): Promise<Ligne> => {
    try {
      const response = await api.get(`/Lignes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ligne with ID ${id}:`, error);
      throw error;
    }
  },

  getLignesByDocumentId: async (documentId: number): Promise<Ligne[]> => {
    try {
      const response = await api.get(`/Lignes/by-document/${documentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching lignes for document ${documentId}:`, error);
      throw error;
    }
  },

  createLigne: async (ligne: CreateLigneRequest): Promise<Ligne> => {
    try {
      const response = await api.post('/Lignes', ligne);
      return response.data;
    } catch (error) {
      console.error('Error creating ligne:', error);
      throw error;
    }
  },

  updateLigne: async (id: number, ligne: UpdateLigneRequest): Promise<void> => {
    try {
      await api.put(`/Lignes/${id}`, ligne);
    } catch (error) {
      console.error(`Error updating ligne with ID ${id}:`, error);
      throw error;
    }
  },

  deleteLigne: async (id: number): Promise<void> => {
    try {
      await api.delete(`/Lignes/${id}`);
    } catch (error) {
      console.error(`Error deleting ligne with ID ${id}:`, error);
      throw error;
    }
  },

  // SousLigne methods
  getAllSousLignes: async (): Promise<SousLigne[]> => {
    try {
      const response = await api.get('/SousLignes');
      return response.data;
    } catch (error) {
      console.error('Error fetching sousLignes:', error);
      throw error;
    }
  },

  getSousLigneById: async (id: number): Promise<SousLigne> => {
    try {
      const response = await api.get(`/SousLignes/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sousLigne with ID ${id}:`, error);
      throw error;
    }
  },

  getSousLignesByLigneId: async (ligneId: number): Promise<SousLigne[]> => {
    try {
      const response = await api.get(`/SousLignes/by_ligne/${ligneId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sousLignes for ligne ${ligneId}:`, error);
      throw error;
    }
  },

  getSousLignesByDocumentId: async (documentId: number): Promise<SousLigne[]> => {
    try {
      const response = await api.get(`/SousLignes/by_document/${documentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching sousLignes for document ${documentId}:`, error);
      throw error;
    }
  },

  createSousLigne: async (sousLigne: CreateSousLigneRequest): Promise<SousLigne> => {
    try {
      const response = await api.post('/SousLignes', sousLigne);
      return response.data;
    } catch (error) {
      console.error('Error creating sousLigne:', error);
      throw error;
    }
  },

  updateSousLigne: async (id: number, sousLigne: UpdateSousLigneRequest): Promise<void> => {
    try {
      await api.put(`/SousLignes/${id}`, sousLigne);
    } catch (error) {
      console.error(`Error updating sousLigne with ID ${id}:`, error);
      throw error;
    }
  },

  deleteSousLigne: async (id: number): Promise<void> => {
    try {
      await api.delete(`/SousLignes/${id}`);
    } catch (error) {
      console.error(`Error deleting sousLigne with ID ${id}:`, error);
      throw error;
    }
  }
};

export default documentService;
