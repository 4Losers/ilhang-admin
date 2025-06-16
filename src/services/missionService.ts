import axiosClient from './axiosClient';

// ✅ 공통 타입
export type MissionType = 'CATEGORY' | 'SEQUENTIAL' | 'MIXED';

// ✅ 조회 응답 타입
export interface Mission {
  templateId: number;
  title: string;
  description: string;
  categoryId: number;
  type: MissionType;
  isActive: boolean;
}

export interface MissionTemplateView {
  templateId: number;
  categoryId: number;
  categoryName: string;
  title: string;
  description: string;
  type: MissionType;
  thumbnailUrl: string;
  isActive: boolean;
  createdTime: string;
  updatedTime: string;
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

// ✅ 생성 요청 타입
export interface CreateMissionTemplateRequest {
  categoryId: number;
  title: string;
  description: string;
  type: MissionType;
  thumbnailUrl: string;
}

// ✅ 수정 요청 타입
export interface UpdateMissionTemplateRequest {
  categoryId: number;
  title: string;
  description: string;
  type: MissionType;
  thumbnailUrl: string;
  detail: string;
}

export interface UpdateMissionInstanceRequest {
  templateId: number;
  subTitle: string;
  subDescription: string;
  orderInTemplate: number;
  nextInstanceId: number | null;
}

export interface UpdateMissionPeriodRequest {
  templateId: number;
  cycleId: number;
}

export interface UpdateMissionPointRequest {
  periodId: number;
  challengePoint: number;
}

// ✅ 조회 API
export const fetchMissions = async (): Promise<MissionTemplateView[]> => {
  const response = await axiosClient.get('/admin/missions/views', {
    params: { page: 1, size: 999 },
  });

  const raw = response.data as any;
  if (Array.isArray(raw.list)) {
    return raw.list;
  }

  console.warn('⚠️ 알 수 없는 응답 형식:', raw);
  return [];
};

export const fetchMissionTemplateDetail = async (
  templateId: number
): Promise<MissionTemplateDetailResponse> => {
  const response = await axiosClient.get<MissionTemplateDetailResponse>(
    `/admin/missions/${templateId}/detail`
  );
  return response.data;
};

// ✅ 생성 API
export const createMission = async (
  mission: CreateMissionTemplateRequest
): Promise<void> => {
  await axiosClient.post('/admin/missions', mission);
};

// 임시 생성 (간소화된 형태)
export const createMissionTemplate = async (
  req: Partial<Mission>
): Promise<void> => {
  await axiosClient.post('/admin/missions', req);
};

// ✅ 수정 API
export const updateMissionTemplate = async (
  templateId: number,
  updated: Partial<Mission>
): Promise<void> => {
  await axiosClient.put(`/admin/missions/${templateId}`, updated);
};

export const updateMissionInstance = async (
  instanceId: number,
  data: UpdateMissionInstanceRequest
): Promise<void> => {
  await axiosClient.put(`/admin/missions/instances/${instanceId}`, data);
};

export const updateMissionPeriod = async (
  periodId: number,
  data: UpdateMissionPeriodRequest
): Promise<void> => {
  await axiosClient.put(`/admin/missions/periods/${periodId}`, data);
};

export const updateMissionPoint = async (
  pointId: number,
  data: UpdateMissionPointRequest
): Promise<void> => {
  await axiosClient.put(`/admin/missions/points/${pointId}`, data);
};

// ✅ 상태 변경 API
export const toggleMissionActive = async (
  templateId: number
): Promise<void> => {
  await axiosClient.patch(`/admin/missions/${templateId}/active`);
};