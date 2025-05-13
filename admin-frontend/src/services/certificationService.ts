// src/services/certificationService.ts
import axiosClient from './axiosClient';

export interface Certification {
  id: number;
  user: string;
  mission: string;
  submittedAt: string;
  imageUrl: string;
  status: '대기' | '승인됨' | '반려됨';
}

export const fetchCertifications = async (): Promise<Certification[]> => {
  const response = await axiosClient.get<Certification[]>('/admin/certifications');
  return response.data;
};

// 인증 상태 변경 (승인 or 반려)
export const updateCertificationStatus = async (
  id: number,
  newStatus: '승인됨' | '반려됨'
): Promise<void> => {
  await axiosClient.patch(`/admin/certifications/${id}`, { status: newStatus });
};