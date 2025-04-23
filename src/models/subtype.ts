import { DocumentType } from "./document";

export interface SubType {
  id: number;
  subTypeKey: string;
  name: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string;
  documentTypeId: number;
  documentType?: {
    typeAlias: string;
    typeKey: string;
    typeName: string;
    typeAttr: string;
  };
  isActive: boolean;
}

export interface CreateSubTypeDto {
  name: string;
  description: string;
  startDate: Date | string;
  endDate: Date | string; 
  documentTypeId: number;
  isActive: boolean;
}

export interface UpdateSubTypeDto {
  name?: string;
  description?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  isActive?: boolean;
}
