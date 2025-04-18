
export interface SubType {
  id: number;
  subTypeKey: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  documentTypeId: number;
  isActive: boolean;
  documentType?: {
    typeKey: string;
    typeName: string;
    typeAttr: string;
  };
}

export interface CreateSubTypeRequest {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  documentTypeId: number;
  isActive?: boolean;
}

export interface UpdateSubTypeRequest {
  name?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}
