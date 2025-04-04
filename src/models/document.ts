
export interface Document {
  id: number;
  title: string;
  documentKey: string;
  content: string;
  status: number;
  documentAlias: string;
  createdAt: string;
  updatedAt: string;
  typeId: number;
  docDate: string;
  documentType: DocumentType;
  circuitId?: number;
  createdByUserId: number;
  createdBy: DocumentUser;
}

export interface DocumentType {
  id?: number;
  typeName: string;
  typeKey?: string;
  typeAttr?: string;
  documentCounter?: number;
}

export interface DocumentUser {
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface CreateDocumentRequest {
  title: string;
  content: string;
  documentAlias?: string;
  typeId: number;
  docDate?: string;
  circuitId?: number;
}

export interface UpdateDocumentRequest {
  title?: string;
  content?: string;
  documentAlias?: string;
  typeId?: number;
  docDate?: string;
  circuitId?: number;
}
