
import api from './api';
import { DocumentType } from '../models/document';

const documentTypeService = {
  getAllDocumentTypes: async (): Promise<DocumentType[]> => {
    try {
      const response = await api.get('/Documents/Types');
      return response.data;
    } catch (error) {
      console.error('Error fetching document types:', error);
      throw error;
    }
  },

  getDocumentTypeById: async (id: number): Promise<DocumentType> => {
    try {
      const response = await api.get(`/Documents/Types/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching document type with ID ${id}:`, error);
      throw error;
    }
  },

  createDocumentType: async (documentType: Partial<DocumentType>): Promise<DocumentType> => {
    try {
      const response = await api.post('/Documents/Types', documentType);
      return response.data;
    } catch (error) {
      console.error('Error creating document type:', error);
      throw error;
    }
  },

  updateDocumentType: async (id: number, documentType: Partial<DocumentType>): Promise<void> => {
    try {
      await api.put(`/Documents/Types/${id}`, documentType);
    } catch (error) {
      console.error(`Error updating document type with ID ${id}:`, error);
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
  }
};

export default documentTypeService;
