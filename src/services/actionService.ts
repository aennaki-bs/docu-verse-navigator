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

// Cache for steps data
let stepsCache: any[] = [];
let stepsCacheTime: number = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Service for managing actions
 */
export const actionService = {
  /**
   * Get all actions
   * @returns Promise<Action[]> List of all actions
   */
  getAllActions: async (): Promise<Action[]> => {
    try {
      const response = await api.get('/Action');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch actions:', error);
      // Return empty array instead of propagating error
      return [];
    }
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
    try {
      const response = await api.get(`/Action/by-step/${stepId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch actions for step ${stepId}:`, error);
      return [];
    }
  },

  /**
   * Get actions by category
   * @param category Action category
   * @returns Promise<Action[]> List of actions in the category
   */
  getActionsByCategory: async (category: ActionCategory): Promise<Action[]> => {
    try {
      const response = await api.get(`/Action/by-category/${category}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch actions for category ${category}:`, error);
      return [];
    }
  },

  /**
   * Get actions by priority
   * @param priority Action priority
   * @returns Promise<Action[]> List of actions with the specified priority
   */
  getActionsByPriority: async (priority: ActionPriority): Promise<Action[]> => {
    try {
      const response = await api.get(`/Action/by-priority/${priority}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch actions for priority ${priority}:`, error);
      return [];
    }
  },

  /**
   * Update status effects for an action-step association
   * @param stepId Step ID
   * @param actionId Action ID
   * @param statusEffects Status effects to update
   */
  updateStatusEffects: async (stepId: number, actionId: number, statusEffects: StatusEffectDto[]): Promise<void> => {
    await api.put(`/Action/step/${stepId}/action/${actionId}/status-effects`, { statusEffects });
  },
  
  /**
   * Get cached or fresh steps for action assignments
   * Uses a local cache to avoid unnecessary API calls when assigning actions to steps
   * @param forceRefresh Force refresh the cache
   * @returns Promise<any[]> List of steps
   */
  getCachedSteps: async (forceRefresh: boolean = false): Promise<any[]> => {
    const now = Date.now();
    
    // Return cached steps if they're still valid
    if (!forceRefresh && stepsCache.length > 0 && (now - stepsCacheTime < CACHE_TTL)) {
      console.log('Using cached steps data');
      return stepsCache;
    }
    
    try {
      // Fetch fresh steps data
      const response = await api.get('/Steps');
      stepsCache = response.data;
      stepsCacheTime = now;
      return stepsCache;
    } catch (error) {
      console.error('Failed to fetch steps:', error);
      // If fresh fetch fails but we have a cache, return it even if expired
      if (stepsCache.length > 0) {
        console.log('Failed to fetch fresh steps, using expired cache');
        return stepsCache;
      }
      return [];
    }
  }
}; 