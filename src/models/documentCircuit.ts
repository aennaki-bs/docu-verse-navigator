
export interface DocumentCircuitHistory {
  id: number;
  documentId: number;
  stepId: number;
  step?: {
    id: number;
    title: string;
  };
  actionId?: number;
  action?: {
    id: number;
    title: string;
  };
  statusId?: number;
  status?: {
    id: number;
    title: string;
  };
  processedByUserId: number;
  processedBy?: {
    id: number;
    username: string;
  };
  processedAt: Date | string;
  comments?: string;
  isApproved: boolean;
  createdAt?: Date | string;
}
