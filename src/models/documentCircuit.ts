
export interface DocumentCircuitHistory {
  id: number;
  documentId: number;
  circuitId: number;
  circuitDetailId: number;
  userId?: number;
  userName?: string;
  processedByUserId?: number;
  processedBy?: string;
  comments: string;
  isApproved: boolean;
  processedAt: string;
  circuitDetail?: {
    title: string;
    orderIndex: number;
  };
  // This field is returned by the backend API
  circuitDetailTitle?: string;
}

export interface ProcessCircuitRequest {
  documentId: number;
  comments: string;
  isApproved: boolean;
}

export interface MoveDocumentStepRequest {
  documentId: number;
  circuitDetailId: number;
}

export interface AssignCircuitRequest {
  documentId: number;
  circuitId: number;
  comments?: string;
}
