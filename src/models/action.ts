
export interface Action {
  id: number;
  actionKey: string;
  title: string;
  description?: string;
}

export interface CreateActionDto {
  title: string;
  description?: string;
}

export interface ActionForm {
  title: string;
  description: string;
}
