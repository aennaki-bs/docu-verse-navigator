
import api from '../api';
import { SubType, CreateSubTypeRequest, UpdateSubTypeRequest } from '../../models/subtype';

const subTypeService = {
  getAllSubTypes: async (): Promise<SubType[]> => {
    try {
      const response = await api.get('/SubType');
      return response.data;
    } catch (error) {
      console.error('Error fetching subtypes:', error);
      throw error;
    }
  },

  getSubTypeById: async (id: number): Promise<SubType> => {
    try {
      const response = await api.get(`/SubType/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subtype with ID ${id}:`, error);
      throw error;
    }
  },

  getSubTypesByDocumentTypeId: async (documentTypeId: number): Promise<SubType[]> => {
    try {
      const response = await api.get(`/SubType/by-document-type/${documentTypeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subtypes for document type ${documentTypeId}:`, error);
      throw error;
    }
  },

  getSubTypesForDate: async (documentTypeId: number, date: string): Promise<SubType[]> => {
    try {
      // Format the date if needed (make sure it's in YYYY-MM-DD format)
      const formattedDate = date.includes('T') ? date.split('T')[0] : date;
      
      // Use encodeURIComponent to properly encode the date in the URL
      const encodedDate = encodeURIComponent(formattedDate);
      
      const response = await api.get(`/SubType/for-date/${documentTypeId}/${encodedDate}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subtypes for date ${date}:`, error);
      throw error;
    }
  },

  createSubType: async (subType: CreateSubTypeRequest): Promise<SubType> => {
    try {
      const response = await api.post('/SubType', subType);
      return response.data;
    } catch (error) {
      console.error('Error creating subtype:', error);
      throw error;
    }
  },

  updateSubType: async (id: number, subType: UpdateSubTypeRequest): Promise<void> => {
    try {
      await api.put(`/SubType/${id}`, subType);
    } catch (error) {
      console.error(`Error updating subtype with ID ${id}:`, error);
      throw error;
    }
  },

  deleteSubType: async (id: number): Promise<void> => {
    try {
      await api.delete(`/SubType/${id}`);
    } catch (error) {
      console.error(`Error deleting subtype with ID ${id}:`, error);
      throw error;
    }
  },
};

export default subTypeService;
