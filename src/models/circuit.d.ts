
interface Circuit {
  id: number;
  circuitKey: string;
  title: string;
  descriptif?: string;
  crdCounter: number;
  isActive: boolean;
  hasOrderedFlow: boolean;
  createdAt: string;
  updatedAt: string;
  circuitDetails?: CircuitDetail[];
}

interface CircuitDetail {
  id: number;
  circuitDetailKey: string;
  circuitId: number;
  title: string;
  descriptif?: string;
  orderIndex: number;
  responsibleRoleId?: number;
  createdAt: string;
  updatedAt: string;
}

interface AssignCircuitRequest {
  documentId: number;
  circuitId: number;
  comments?: string;
}

interface ProcessCircuitRequest {
  documentId: number;
  comments: string;
  isApproved: boolean;
}

interface MoveDocumentStepRequest {
  documentId: number;
  circuitDetailId: number;
}

interface DocumentCircuitHistoryDto {
  id: number;
  documentId: number;
  circuitId: number;
  circuitDetailId: number;
  userId: number;
  userName: string;
  comments: string;
  isApproved: boolean;
  processedAt: string;
  circuitDetail: {
    title: string;
    orderIndex: number;
  };
}
