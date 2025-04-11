
// Circuit types matching the new schema
export interface Circuit {
  id: number;
  circuitKey: string;
  title: string;
  descriptif: string;
  isActive: boolean;
  hasOrderedFlow: boolean;
  allowBacktrack: boolean;
  crdCounter: number;
}

export interface Step {
  id: number;
  stepKey: string;
  circuitId: number;
  circuit?: Circuit;
  title: string;
  descriptif: string;
  orderIndex: number;
  responsibleRoleId?: number;
  responsibleRole?: Role;
  nextStepId?: number;
  prevStepId?: number;
  isFinalStep: boolean;
}

export interface Status {
  id: number;
  statusKey: string;
  stepId: number;
  title: string;
  isRequired: boolean;
  isComplete: boolean;
}

export interface Action {
  id: number;
  actionKey: string;
  title: string;
  description?: string;
}

export interface StepAction {
  id: number;
  stepId: number;
  actionId: number;
  step?: Step;
  action?: Action;
}

export interface DocumentHistory {
  id: number;
  documentId: number;
  stepId: number;
  step?: Step;
  actionId: number;
  action?: Action;
  statusId?: number;
  status?: Status;
  processedByUserId: number;
  processedBy?: User;
  processedAt: string;
  comments?: string;
  isApproved: boolean;
}

export interface DocumentStatus {
  id: number;
  documentId: number;
  statusId: number;
  isComplete: boolean;
  completedByUserId?: number;
  completedBy?: User;
  completedAt?: string;
  status?: Status;
}

export interface AssignCircuitRequest {
  documentId: number;
  circuitId: number;
}

export interface ProcessCircuitRequest {
  documentId: number;
  actionId: number;
  comments?: string;
  isApproved: boolean;
}

export interface MoveDocumentStepRequest {
  documentId: number;
  stepId: number;
}

export interface DocumentCircuitHistoryDto {
  id: number;
  stepTitle: string;
  actionTitle: string;
  processedBy: string;
  processedAt: string;
  comments?: string;
  isApproved: boolean;
}
