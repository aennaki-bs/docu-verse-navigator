
import { Circuit, Step } from './circuit';
import { User } from './types';

// Updating just the document interface to match the new schema
export interface Document {
  id: number;
  documentKey: string;
  title: string;
  content: string;
  docDate: string;
  status: number; // 0=Draft, 1=In Progress, 2=Completed, 3=Rejected
  documentAlias?: string;
  circuitId?: number | null;
  circuit?: Circuit;
  currentStepId?: number | null;
  currentStep?: Step;
  isCircuitCompleted: boolean;
  typeId: number;
  documentType: DocumentType;
  createdByUserId: number;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
  lignesCount?: number;
  // Legacy properties still in use by components
  currentCircuitDetailId?: number;
}

export interface DocumentType {
  id: number;
  typeName: string;
  // Legacy properties still in use by components
  typeKey?: string;
  typeAttr?: string;
  documentCounter?: number;
}

export interface CreateDocumentRequest {
  title: string;
  content?: string;
  docDate: string;
  status: number;
  documentAlias?: string;
  typeId: number;
}

export interface UpdateDocumentRequest {
  title: string;
  content?: string;
  docDate: string;
  status: number;
  documentAlias?: string;
  typeId: number;
}

export interface Ligne {
  id: number;
  documentId: number;
  title: string;
  description?: string;
  amount: number;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  sousLignesCount?: number;
  // Legacy properties still in use by components
  ligneKey?: string;
  article?: string;
  prix?: number;
}

export interface CreateLigneRequest {
  documentId: number;
  title: string;
  description?: string;
  amount: number;
  orderIndex?: number;
  // Legacy properties still in use by components
  article?: string;
  prix?: number;
}

export interface UpdateLigneRequest {
  title: string;
  description?: string;
  amount: number;
  orderIndex?: number;
  // Legacy properties still in use by components
  article?: string;
  prix?: number;
}

export interface SousLigne {
  id: number;
  ligneId: number;
  title: string;
  description?: string;
  amount: number;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  // Legacy properties still in use by components
  sousLigneKey?: string;
  attribute?: string;
}

export interface CreateSousLigneRequest {
  ligneId: number;
  title: string;
  description?: string;
  amount: number;
  orderIndex?: number;
  // Legacy properties still in use by components
  attribute?: string;
}

export interface UpdateSousLigneRequest {
  title: string;
  description?: string;
  amount: number;
  orderIndex?: number;
  // Legacy properties still in use by components
  attribute?: string;
}
