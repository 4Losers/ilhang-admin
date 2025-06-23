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