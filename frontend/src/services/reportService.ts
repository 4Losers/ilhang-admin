// src/services/reportService.ts
import axiosClient from './axiosClient';

export interface Report {
  id: number;
  reportedType: '인증' | '유저';
  reportedTarget: string;
  reason: string;
  status: '처리 전' | '처리 완료';
}

export const fetchReports = async (): Promise<Report[]> => {
  const response = await axiosClient.get<Report[]>('/admin/reports');
  return response.data;
};
