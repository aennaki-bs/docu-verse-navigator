
export interface DocumentCircuitHistory {
  id: number;
  documentId: number;
  circuitDetailId: number;
  processedByUserId: number;
  processedBy?: string;
  processedAt: string;
  comments: string;
  isApproved: boolean;
  actionTitle?: string;
  statusTitle?: string;
  createdAt: string; // Adding this missing field
}

export interface ActionDto {
  actionId: number;
  title: string;
  description: string;
}

export interface DocumentWorkflowStatus {
  documentId: number;
  documentTitle: string;
  circuitId?: number;
  circuitTitle?: string;
  currentStepId?: number;
  currentStepTitle?: string;
  status: number;
  statusText: string;
  isCircuitCompleted: boolean;
  statuses: DocumentStatus[];
  availableActions: ActionDto[];
  canAdvanceToNextStep: boolean;
  canReturnToPreviousStep: boolean;
}

export interface DocumentStatus {
  statusId: number;
  title: string;
  isRequired: boolean;
  isComplete: boolean;
  completedBy?: string;
  completedAt?: string;
}
