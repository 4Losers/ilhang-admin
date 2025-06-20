import axiosClient from './axiosClient';

// ✅ 공통 타입
export type MissionType = 'CATEGORY' | 'SEQUENTIAL' | 'MIXED';

// ✅ 미션 인스턴스 타입
export interface MissionInstance {
  instanceId: number;
  subTitle: string;
  subDescription: string;
  orderInTemplate: number;
  nextInstanceId: number | null;
}

// ✅ 미션 주기 타입
export interface MissionPeriod {
  periodId: number;
  cycleId: number;
}

// ✅ 미션 포인트 타입
export interface MissionPoint {
  pointId: number;
  periodId: number;
  challengePoint: number;
}

// ✅ 미션 상세 정보 타입 (공통)
export interface MissionDetail {
  goodPoints: string[];
  howToProceed: string[];
  certification: {
    description: string;
    deadline: string;
    examples: {
      imageUrl: string;
      caption: string;
      success: boolean;
    }[];
  };
  challengeInfo: {
    availableCycles: string[];
    estimatedDuration: string;
  };
  relatedMissionIds: number[];
}

// ✅ 기본 미션 타입
export interface Mission {
  templateId: number;
  title: string;
  description: string;
  categoryId: number;
  type: MissionType;
  isActive: boolean;
}

// ✅ 미션 템플릿 조회용 타입
export interface MissionTemplateView extends Mission {
  categoryName: string;
  thumbnailUrl: string;
  createdTime: string;
  updatedTime: string;
  detail?: MissionDetail;
}

// ✅ 미션 템플릿 상세 응답 타입
export interface MissionTemplateDetailResponse extends Mission {
  thumbnailUrl: string;
  detail: MissionDetail;
  instances: MissionInstance[];
  periods: MissionPeriod[];
  points: MissionPoint[];
}

// ✅ 생성 요청 타입
export interface CreateMissionTemplateRequest {
  categoryId: number;
  title: string;
  description: string;
  type: MissionType;
  thumbnailUrl: string;
}

// ✅ 상세 수정 요청 타입
export interface UpdateMissionTemplateWithDetailRequest {
  categoryId: number;
  title: string;
  description: string;
  type: MissionType;
  thumbnailUrl: string;
  detail: MissionDetail;
}

// ✅ 개별 엔티티 수정 요청 타입들
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

// ✅ 개별 엔티티 생성 요청 타입들
export interface CreateMissionInstanceRequest {
  templateId: number;
  subTitle: string;
  subDescription: string;
  orderInTemplate: number;
  nextInstanceId: number | null;
}

export interface CreateMissionPeriodRequest {
  templateId: number;
  cycleId: number;
}

export interface CreateMissionPointRequest {
  periodId: number;
  challengePoint: number;
}

// ✅ 생성 응답 타입들
export interface CreateMissionInstanceResponse {
  instanceId: number;
  templateId: number;
  subTitle: string;
  subDescription: string;
  orderInTemplate: number;
  nextInstanceId: number | null;
}

export interface CreateMissionPeriodResponse {
  periodId: number;
  templateId: number;
  cycleId: number;
}

export interface CreateMissionPointResponse {
  pointId: number;
  periodId: number;
  challengePoint: number;
}

// ✅ 유효성 검사 타입
export interface ValidationErrors {
  title?: boolean;
  description?: boolean;
  categoryId?: boolean;
  type?: boolean;
  name?: boolean;
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

// 간소화된 생성 API (신규 템플릿용)
export const createMissionTemplate = async (
  req: Partial<Mission>
): Promise<void> => {
  await axiosClient.post('/admin/missions', req);
};

// ✅ 목록에서 간단한 필드 수정용 (title, type 등)
export const updateMissionTemplate = async (
  templateId: number,
  updated: Partial<Mission>
): Promise<void> => {
  await axiosClient.put(`/admin/missions/${templateId}`, updated);
};

// ✅ 상세 Drawer에서 전체 정보 포함 저장용
export const updateMissionTemplateWithDetail = async (
  templateId: number,
  detail: MissionTemplateDetailResponse
): Promise<void> => {
  // MissionTemplateDetailResponse는 이미 flatten된 구조이므로
  // 중첩된 detail 객체로 변환해서 전송
  const requestData = {
    categoryId: detail.categoryId,
    title: detail.title,
    description: detail.description,
    type: detail.type,
    thumbnailUrl: detail.thumbnailUrl,
    detail: {
      goodPoints: detail.detail.goodPoints || [],
      howToProceed: detail.detail.howToProceed || [],
      certification: {
        description: detail.detail.certification?.description || '',
        deadline: detail.detail.certification?.deadline || '',
        examples: detail.detail.certification?.examples || [],
      },
      challengeInfo: {
        availableCycles: detail.detail.challengeInfo?.availableCycles || [],
        estimatedDuration: detail.detail.challengeInfo?.estimatedDuration || '',
      },
      relatedMissionIds: detail.detail.relatedMissionIds || [],
    },
  };

  await axiosClient.put(`/admin/missions/${templateId}`, requestData);
};

// ✅ 미션 인스턴스 수정
export const updateMissionInstance = async (
  instanceId: number,
  data: UpdateMissionInstanceRequest
): Promise<void> => {
  await axiosClient.put(`/admin/missions/instances/${instanceId}`, data);
};

// ✅ 주기 수정
export const updateMissionPeriod = async (
  periodId: number,
  data: UpdateMissionPeriodRequest
): Promise<void> => {
  await axiosClient.put(`/admin/missions/periods/${periodId}`, data);
};

// ✅ 도전금 수정
export const updateMissionPoint = async (
  pointId: number,
  data: UpdateMissionPointRequest
): Promise<void> => {
  await axiosClient.put(`/admin/missions/points/${pointId}`, data);
};

// ✅ 미션 인스턴스 생성
export const createMissionInstance = async (
  data: CreateMissionInstanceRequest
): Promise<CreateMissionInstanceResponse> => {
  const response = await axiosClient.post<CreateMissionInstanceResponse>(
    '/admin/missions/instances',
    data
  );
  return response.data;
};

// ✅ 주기 생성
export const createMissionPeriod = async (
  data: CreateMissionPeriodRequest
): Promise<CreateMissionPeriodResponse> => {
  const response = await axiosClient.post<CreateMissionPeriodResponse>(
    '/admin/missions/periods',
    data
  );
  return response.data;
};

// ✅ 도전금 생성
export const createMissionPoint = async (
  data: CreateMissionPointRequest
): Promise<CreateMissionPointResponse> => {
  const response = await axiosClient.post<CreateMissionPointResponse>(
    '/admin/missions/points',
    data
  );
  return response.data;
};

// ✅ 이미지 업로드
export const uploadImage = async (file: File): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append('image', file);

  const response = await axiosClient.post<{ imageUrl: string }>(
    '/admin/upload',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

// ✅ 상세 정보 수정
export const updateMissionDetail = async (
  templateId: number,
  missionData: {
    templateId: number;
    categoryId: number;
    title: string;
    description: string;
    type: MissionType;
    thumbnailUrl: string;
    isActive: boolean;
    detail: MissionDetail;
  }
): Promise<void> => {
  try {
    await axiosClient.put(`/admin/missions/${templateId}`, missionData);
  } catch (error) {
    if ((error as any).response) {
      // 에러 응답 처리
    }
    throw error;
  }
};

// ✅ 상태 활성/비활성 토글
export const toggleMissionActive = async (
  templateId: number
): Promise<void> => {
  await axiosClient.patch(`/admin/missions/${templateId}/active`);
};