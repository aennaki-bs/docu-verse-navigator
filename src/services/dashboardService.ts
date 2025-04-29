import api from './api';
import { Document } from '@/models/document';

export interface DashboardStats {
  totalDocuments: number;
  activeCircuits: number;
  pendingApprovals: number;
  teamMembers: number;
  documentActivity: Array<{ month: string; value: number }>;
  weeklyStats: Array<{ name: string; value: number }>;
  completionRate: number;
  activityScore: {
    activeUsers: number;
    score: number;
  };
}

const dashboardService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = await api.get('/Dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getDocumentActivity: async (startDate: Date, endDate: Date): Promise<Array<{ month: string; value: number }>> => {
    try {
      const response = await api.get('/Dashboard/document-activity', {
        params: { startDate: startDate.toISOString(), endDate: endDate.toISOString() }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching document activity:', error);
      throw error;
    }
  },

  getWeeklyStats: async (): Promise<Array<{ name: string; value: number }>> => {
    try {
      const response = await api.get('/Dashboard/weekly-stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
      throw error;
    }
  },

  getCompletionRate: async (): Promise<number> => {
    try {
      const response = await api.get('/Dashboard/completion-rate');
      return response.data;
    } catch (error) {
      console.error('Error fetching completion rate:', error);
      throw error;
    }
  },

  getActivityScore: async (): Promise<{ activeUsers: number; score: number }> => {
    try {
      const response = await api.get('/Dashboard/activity-score');
      return response.data;
    } catch (error) {
      console.error('Error fetching activity score:', error);
      throw error;
    }
  }
};

export default dashboardService; 