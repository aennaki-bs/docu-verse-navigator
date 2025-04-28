
export interface DocumentType {
  id: number;
  typeKey: string;
  typeName: string;
  typeAttr?: string;
  documentCounter?: number;
  name?: string; // Some parts of the code refer to typeName as name
  docCounter?: number;
}

export interface DocumentTypeUpdateRequest {
  typeKey?: string;
  typeName?: string;
  typeAttr?: string;
  documentCounter?: number; // Adding this field to match the usage in DocumentTypeForm
}
