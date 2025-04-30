import api from './api/index';
import { 
  Action, 
  CreateActionDto, 
  UpdateActionDto, 
  AssignActionToStepDto, 
  StatusEffectDto,
  ActionCategory,
  ActionPriority
} from '@/models/action';

/**
 * Service for managing actions
 */
export const actionService = {
  /**
   * Get all actions
   * @returns Promise<Action[]> List of all actions
   */
  getAllActions: async (): Promise<Action[]> => {
    const response = await api.get('/Action');
    return response.data;
  },

  /**
   * Get action by ID
   * @param id Action ID
   * @returns Promise<Action> Action details
   */
  getActionById: async (id: number): Promise<Action> => {
    const response = await api.get(`/Action/${id}`);
    return response.data;
  },

  /**
   * Create a new action
   * @param data Action data
   * @returns Promise<Action> Created action
   */
  createAction: async (data: CreateActionDto): Promise<Action> => {
    const response = await api.post('/Action', data);
    return response.data;
  },

  /**
   * Update an existing action
   * @param id Action ID
   * @param data Updated action data
   * @returns Promise<Action> Updated action
   */
  updateAction: async (id: number, data: UpdateActionDto): Promise<Action> => {
    const response = await api.put(`/Action/${id}`, data);
    return response.data;
  },

  /**
   * Delete an action
   * @param id Action ID
   */
  deleteAction: async (id: number): Promise<void> => {
    await api.delete(`/Action/${id}`);
  },

  /**
   * Toggle action status (active/inactive)
   * @param id Action ID
   * @returns Promise<Action> Updated action with toggled status
   */
  toggleActionStatus: async (id: number): Promise<Action> => {
    const response = await api.patch(`/Action/${id}/toggle-status`);
    return response.data;
  },

  /**
   * Assign an action to a step
   * @param data Assignment data
   */
  assignToStep: async (data: AssignActionToStepDto): Promise<void> => {
    await api.post('/Action/assign-to-step', data);
  },

  /**
   * Get actions available for a specific step
   * @param stepId Step ID
   * @returns Promise<Action[]> List of actions for the step
   */
  getActionsByStep: async (stepId: number): Promise<Action[]> => {
    const response = await api.get(`/Action/by-step/${stepId}`);
    return response.data;
  },

  /**
   * Get actions by category
   * @param category Action category
   * @returns Promise<Action[]> List of actions in the category
   */
  getActionsByCategory: async (category: ActionCategory): Promise<Action[]> => {
    const response = await api.get(`/Action/by-category/${category}`);
    return response.data;
  },

  /**
   * Get actions by priority
   * @param priority Action priority
   * @returns Promise<Action[]> List of actions with the specified priority
   */
  getActionsByPriority: async (priority: ActionPriority): Promise<Action[]> => {
    const response = await api.get(`/Action/by-priority/${priority}`);
    return response.data;
  },

  /**
   * Update status effects for an action-step association
   * @param stepId Step ID
   * @param actionId Action ID
   * @param statusEffects Status effects to update
   */
  updateStatusEffects: async (stepId: number, actionId: number, statusEffects: StatusEffectDto[]): Promise<void> => {
    await api.put(`/Action/step/${stepId}/action/${actionId}/status-effects`, { statusEffects });
  }
}; 