// src/services/adminService.ts
import axiosClient from './axiosClient';

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: '최고 관리자' | '일반 운영자';
}

export const fetchAdmins = async (): Promise<Admin[]> => {
  const response = await axiosClient.get<Admin[]>('/admin/accounts');
  return response.data;
};
