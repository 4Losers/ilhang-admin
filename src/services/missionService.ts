import axiosClient from './axiosClient';

// ✅ 공통 타입
export type MissionType = 'CATEGORY' | 'SEQUENTIAL' | 'MIXED';

// ✅ 미션 목록 응답 타입
export interface Mission {
  templateId: number;
  title: string;
  description: string;
  categoryId: number;
  type: MissionType;
  isActive: boolean;
}

// ✅ 미션 생성 요청 타입 (템플릿 전용)
export interface CreateMissionTemplateRequest {
  categoryId: number;
  title: string;
  description: string;
  type: MissionType;
  thumbnailUrl: string;
}

export interface MissionInstanceResponse {
  instanceId: number;
  templateId: number;
  subTitle: string;
  subDescription: string;
  orderInTemplate: number;
  nextInstanceId: number | null;
}

export interface MissionPeriodResponse {
  periodId: number;
  templateId: number;
  cycleId: number;
}

export interface MissionPointResponse {
  pointId: number;
  periodId: number;
  challengePoint: number;
}

export interface MissionTemplateDetailResponse {
  template: Mission;
  instances: MissionInstanceResponse[];
  periods: MissionPeriodResponse[];
  points: MissionPointResponse[];
}

// ✅ 미션 목록 조회
export const fetchMissions = async (): Promise<Mission[]> => {
  const response = await axiosClient.get<Mission[]>('/admin/missions');
  return response.data;
};

// ✅ 미션 템플릿 생성 (thumbnailUrl 포함된 정식 생성 요청)
export const createMission = async (mission: CreateMissionTemplateRequest): Promise<void> => {
  await axiosClient.post('/admin/missions', mission);
};

// ✅ 미션 템플릿 임시 생성 (인라인 작성용)
export const createMissionTemplate = async (req: Partial<Mission>): Promise<void> => {
  await axiosClient.post('/admin/missions', req);
};

// ✅ 템플릿 활성화/비활성화 토글
export const toggleMissionActive = async (templateId: number): Promise<void> => {
  await axiosClient.patch(`/admin/missions/${templateId}/active`);
};

// ✅ 미션 템플릿 수정
export const updateMissionTemplate = async (
  templateId: number,
  updated: Partial<Mission>
): Promise<void> => {
  await axiosClient.put(`/admin/missions/${templateId}`, updated);
};

export const fetchMissionTemplateDetail = async (
  templateId: number
): Promise<MissionTemplateDetailResponse> => {
  const response = await axiosClient.get<MissionTemplateDetailResponse>(`/admin/missions/${templateId}/detail`);
  return response.data;
};