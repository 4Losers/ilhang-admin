// src/services/matchingService.ts
import axiosClient from './axiosClient';

export interface Matching {
  id: number;
  cycleName: string;
  matchStart: string;
  matchEnd: string;
  status: '대기' | '진행중' | '종료';
}

export const fetchMatchings = async (): Promise<Matching[]> => {
  const response = await axiosClient.get<Matching[]>('/admin/matchings');
  return response.data;
};
