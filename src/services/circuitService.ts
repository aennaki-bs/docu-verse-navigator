
import api from './api';
import { 
  Circuit, Step, Status, Action, StepAction, 
  DocumentHistory, DocumentStatus, DocumentCircuitHistoryDto,
  AssignCircuitRequest, ProcessCircuitRequest, MoveDocumentStepRequest
} from '@/models/circuit';

/**
 * Service for managing circuits and document workflow
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

  // Step endpoints (formerly CircuitDetail)
  getAllSteps: async (): Promise<Step[]> => {
    const response = await api.get('/Step');
    return response.data;
  },

  getStepById: async (id: number): Promise<Step> => {
    const response = await api.get(`/Step/${id}`);
    return response.data;
  },

  getStepsByCircuitId: async (circuitId: number): Promise<Step[]> => {
    if (circuitId === 0 || !circuitId) return [];
    const response = await api.get(`/Step/by-circuit/${circuitId}`);
    return response.data;
  },

  createStep: async (step: Omit<Step, 'id' | 'stepKey'>): Promise<Step> => {
    const response = await api.post('/Step', step);
    return response.data;
  },

  updateStep: async (id: number, step: Step): Promise<void> => {
    await api.put(`/Step/${id}`, step);
  },

  deleteStep: async (id: number): Promise<void> => {
    await api.delete(`/Step/${id}`);
  },

  // Status endpoints
  getStatusesByStepId: async (stepId: number): Promise<Status[]> => {
    const response = await api.get(`/Status/by-step/${stepId}`);
    return response.data;
  },

  getDocumentStatusesByDocumentId: async (documentId: number): Promise<DocumentStatus[]> => {
    const response = await api.get(`/DocumentStatus/by-document/${documentId}`);
    return response.data;
  },

  updateDocumentStatus: async (id: number, documentStatus: DocumentStatus): Promise<void> => {
    await api.put(`/DocumentStatus/${id}`, documentStatus);
  },

  // Action endpoints
  getAllActions: async (): Promise<Action[]> => {
    const response = await api.get('/Action');
    return response.data;
  },

  getActionsByStepId: async (stepId: number): Promise<Action[]> => {
    const response = await api.get(`/Action/by-step/${stepId}`);
    return response.data;
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

  getDocumentCircuitHistory: async (documentId: number): Promise<DocumentHistory[]> => {
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
