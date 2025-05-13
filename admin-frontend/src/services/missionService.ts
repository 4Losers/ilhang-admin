// src/services/missionService.ts
import axiosClient from './axiosClient';

export interface Mission {
  id: number;
  groupName: string;
  challengePoint: number;
  period: string;
  status: '활성' | '비활성';
}

export const fetchMissions = async (): Promise<Mission[]> => {
  const response = await axiosClient.get<Mission[]>('/admin/missions');
  return response.data;
};
