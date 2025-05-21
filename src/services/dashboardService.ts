// src/services/dashboardService.ts
import axiosClient from './axiosClient';

export interface DashboardStats {
  totalUsers: number;
  activeMissions: number;
  certificationApprovalRate: number;
  matchSuccessRate: number;
}

export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const totalRes = await axiosClient.get<number>('/admin/users/dashboard/total-users');

  return {
    totalUsers: totalRes.data,
    activeMissions: 0,
    certificationApprovalRate: 0,
    matchSuccessRate: 0,
  };
};