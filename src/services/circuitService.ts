
import api from './api';
import { DocumentCircuitHistory, ProcessCircuitRequest, MoveDocumentStepRequest, AssignCircuitRequest } from '@/models/documentCircuit';

/**
 * Service for managing circuits
 */
const circuitService = {
  // Circuit endpoints
  getAllCircuits: async (): Promise<Circuit[]> => {
    const response = await api.get('/Circuit');
    return response.data;
  },

  getCircuitById: async (id: number): Promise<Circuit> => {
    const response = await api.get(`/Circuit/${id}`);
    return response.data;
  },

  createCircuit: async (circuit: Omit<Circuit, 'id' | 'circuitKey' | 'crdCounter'>): Promise<Circuit> => {
    const response = await api.post('/Circuit', circuit);
    return response.data;
  },

  updateCircuit: async (id: number, circuit: Circuit): Promise<void> => {
    await api.put(`/Circuit/${id}`, circuit);
  },

  deleteCircuit: async (id: number): Promise<void> => {
    await api.delete(`/Circuit/${id}`);
  },

  // Circuit Details endpoints
  getAllCircuitDetails: async (): Promise<CircuitDetail[]> => {
    const response = await api.get('/CircuitDetail');
    return response.data;
  },

  getCircuitDetailById: async (id: number): Promise<CircuitDetail> => {
    const response = await api.get(`/CircuitDetail/${id}`);
    return response.data;
  },

  getCircuitDetailsByCircuitId: async (circuitId: number): Promise<CircuitDetail[]> => {
    if (circuitId === 0 || !circuitId) return [];
    const response = await api.get(`/CircuitDetail/by-circuit/${circuitId}`);
    return response.data;
  },

  createCircuitDetail: async (detail: Omit<CircuitDetail, 'id' | 'circuitDetailKey'>): Promise<CircuitDetail> => {
    const response = await api.post('/CircuitDetail', detail);
    return response.data;
  },

  updateCircuitDetail: async (id: number, detail: CircuitDetail): Promise<void> => {
    await api.put(`/CircuitDetail/${id}`, detail);
  },

  deleteCircuitDetail: async (id: number): Promise<void> => {
    await api.delete(`/CircuitDetail/${id}`);
  },

  // Circuit Processing endpoints
  assignDocumentToCircuit: async (request: AssignCircuitRequest): Promise<void> => {
    await api.post('/CircuitProcessing/assign', request);
  },

  processCircuitStep: async (request: ProcessCircuitRequest): Promise<void> => {
    console.log('Processing circuit step:', request);
    await api.post('/CircuitProcessing/process', request);
  },

  moveDocumentToStep: async (request: MoveDocumentStepRequest): Promise<void> => {
    console.log('Moving document to step:', request);
    await api.post('/CircuitProcessing/move-to-step', request);
  },

  getDocumentCircuitHistory: async (documentId: number): Promise<DocumentCircuitHistory[]> => {
    if (!documentId) return [];
    const response = await api.get(`/CircuitProcessing/history/${documentId}`);
    return response.data;
  },

  getPendingDocuments: async (): Promise<any[]> => {
    const response = await api.get('/CircuitProcessing/pending');
    return response.data;
  },
  
  getPendingApprovals: async (): Promise<any[]> => {
    const response = await api.get('/CircuitProcessing/pending-approvals');
    return response.data;
  },
};

export default circuitService;
