import axiosClient from './axiosClient';

export interface Matching {
  instanceId: number;
  cycleName: string;
  matchStartTime: string;
  matchEndTime: string;
  status: 'RECRUITING' | 'MATCHING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
}

export interface PageResponse<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
  pages: number;
}

export const fetchMatchings = async (): Promise<Matching[]> => {
  const response = await axiosClient.get<PageResponse<Matching>>('/admin/matches');
  console.log('✅ 실제 데이터:', response.data);
  return response.data.list;
};