export interface Action {
  actionId: number;
  actionKey: string;
  title: string;
  description: string;
}

export interface CreateActionDto {
  title: string;
  description: string;
}

export interface UpdateActionDto {
  title: string;
  description: string;
}

export interface StatusEffectDto {
  statusId: number;
  setsComplete: boolean;
}

export interface AssignActionToStepDto {
  stepId: number;
  actionId: number;
  statusEffects?: StatusEffectDto[];
}

export interface ActionForm extends UpdateActionDto {
  actionKey?: string;
  requiresComment?: boolean;
}
