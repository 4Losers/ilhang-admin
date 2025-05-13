// src/services/userService.ts
import axiosClient from './axiosClient';

export interface User {
  id: number;
  nickname: string;
  email: string;
  joinedAt: string;
  status: '정상' | '정지됨';
}

export const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosClient.get<User[]>('/admin/users');
  return response.data;
};
