// src/services/dashboardService.ts
import axiosClient from './axiosClient';

export interface DashboardStats {
  totalUsers: number;
  activeMissions: number;
  certificationApprovalRate: number; // 0.93
  matchSuccessRate: number;          // 0.82
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axiosClient.get<DashboardStats>('/admin/dashboard/stats');
  return response.data;
};
