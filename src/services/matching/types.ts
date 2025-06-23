// ✅ 매칭 관련 타입 정의

// ===== 매치 현황 관련 =====
export interface MatchCycle {
    id: number;
    name: string;
    cycleType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
}

// 백엔드 API 응답 구조에 맞춘 MatchInstance 타입
export interface MatchInstance {
    instanceId: number;
    cycleId: number;
    cycleName: string;
    description: string;
    sequenceNumber: number;
    status: 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    applicationStartTime: string;
    applicationEndTime: string;
    matchingExecTime: string;
    matchStartTime: string;
    matchEndTime: string;
    totalGroups: number;
    totalParticipants: number;
    totalTeams: number;
    createdAt: string;
    updatedAt: string;
}

// 백엔드 API 응답 구조에 맞춘 MatchInstanceDetail 타입
export interface MatchInstanceDetail {
    instanceId: number;
    cycleId: number;
    cycleName: string;
    description: string;
    sequenceNumber: number;
    status: 'RECRUITING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    applicationStartTime: string;
    applicationEndTime: string;
    matchingExecTime: string;
    matchStartTime: string;
    matchEndTime: string;
    defaultLifePoint: number;
    totalApplications: number;
    totalGroups: number;
    totalParticipants: number;
    totalTeams: number;
    createdAt: string;
    updatedAt: string;
    groups: MatchGroup[];
}

export interface MatchGroup {
    matchGroupId: number;
    missionId: number;
    matchSize: number;
    teamCount: number;
    participantCount: number;
    challengePoint: number;
    lifePoint: number;
    status: 'CREATED' | 'MATCHING' | 'MATCHED' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
}

export interface MatchTeam {
    id: number;
    groupId: number;
    name: string;
    status: 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
    participants: MatchParticipant[];
    createdAt: string;
}

export interface MatchParticipant {
    id: number;
    teamId: number;
    userId: number;
    nickname: string;
    profileImage?: string;
    status: 'ACTIVE' | 'DROPPED' | 'COMPLETED';
    joinDate: string;
}

// ===== 매치 회차 관리 관련 =====
export interface CycleConfig {
    id: number;
    name: string;
    cycleType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    startTime: string; // HH:mm 형식
    challengeAmount: number;
    maxParticipants: number;
    minParticipants: number;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
}

export interface CycleConfigRequest {
    name: string;
    cycleType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    startTime: string;
    challengeAmount: number;
    maxParticipants: number;
    minParticipants: number;
}

export interface CycleConfigResponse {
    id: number;
    name: string;
    cycleType: 'DAILY' | 'WEEKLY' | 'MONTHLY';
    startTime: string;
    challengeAmount: number;
    maxParticipants: number;
    minParticipants: number;
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt: string;
}

export interface InstanceConfig {
    id: number;
    cycleId: number;
    cycleName: string;
    startDate: string;
    endDate: string;
    challengeAmount: number;
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    createdAt: string;
}

export interface InstanceConfigRequest {
    cycleId: number;
    startDate: string;
    endDate: string;
    challengeAmount: number;
}

// ===== 신청자 관리 관련 =====
export interface MatchApplicant {
    id: number;
    userId: number;
    nickname: string;
    profileImage?: string;
    instanceId: number;
    instanceName: string;
    missionId: number;
    missionName: string;
    status: 'WAITING' | 'ACCEPTED' | 'CANCELLED' | 'REJECTED';
    appliedAt: string;
    acceptedAt?: string;
    cancelledAt?: string;
}

// ===== 매칭 로그 관련 =====
export interface MatchingLog {
    id: number;
    timestamp: string;
    adminId: number;
    adminName: string;
    action: 'GROUP_CANCEL' | 'TEAM_CANCEL' | 'USER_DROP' | 'MANUAL_MATCH' | 'SETTING_CHANGE';
    targetType: 'GROUP' | 'TEAM' | 'USER' | 'INSTANCE' | 'CYCLE';
    targetId: number;
    targetName: string;
    description: string;
    details?: Record<string, any>;
}

// ===== 설정 관련 =====
export interface MatchingSettings {
    id: number;
    cycleId: number;
    matchingStrategy: 'SUCCESS_RATE' | 'RANDOM' | 'LEVEL_BASED' | 'TIME_BASED';
    teamSize: {
        min: number;
        max: number;
        preferred: number;
    };
    priorityConditions: {
        highSuccessRate: boolean;
        similarLevel: boolean;
        timeZone: boolean;
        language: boolean;
    };
    autoMatching: {
        enabled: boolean;
        delayMinutes: number;
        maxRetries: number;
    };
    createdAt: string;
    updatedAt: string;
}

export interface MatchingSettingsRequest {
    cycleId: number;
    matchingStrategy: 'SUCCESS_RATE' | 'RANDOM' | 'LEVEL_BASED' | 'TIME_BASED';
    teamSize: {
        min: number;
        max: number;
        preferred: number;
    };
    priorityConditions: {
        highSuccessRate: boolean;
        similarLevel: boolean;
        timeZone: boolean;
        language: boolean;
    };
    autoMatching: {
        enabled: boolean;
        delayMinutes: number;
        maxRetries: number;
    };
}

// ===== 공통 응답 타입 =====
export interface PageInfo<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// ===== 필터/검색 타입 =====
export interface MatchHistoryFilter {
    cycleId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
}

export interface ApplicantFilter {
    instanceId?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
}

export interface LogFilter {
    adminId?: number;
    action?: string;
    targetType?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    size?: number;
}

// ✅ 백엔드 API 응답 구조에 맞춘 페이지네이션 타입들
export interface BackendPageResponse<T> {
    total: number;
    list: T[];
    pageNum: number;
    pageSize: number;
    size: number;
    startRow: number;
    endRow: number;
    pages: number;
    prePage: number;
    nextPage: number;
    isFirstPage: boolean;
    isLastPage: boolean;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    navigatePages: number;
    navigatepageNums: number[];
    navigateFirstPage: number;
    navigateLastPage: number;
}

export interface PageResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
    };
    totalElements: number;
    totalPages: number;
    last: boolean;
    first: boolean;
    size: number;
    number: number;
}

// 백엔드 API 응답 타입들
export interface MatchOverviewResponse {
    cycleId: number;
    cycleName: string;
    instanceId: number;
    instanceStartTime: string;
    instanceEndTime: string;
    matchGroupCount: number;
    matchGroups: MatchGroup[];
    missionId?: number;
    missionName?: string;
    missionDescription?: string;
}

export interface MatchCycleConfigRequest extends CycleConfigRequest { }

// 백엔드 API 엔드포인트에 맞춘 타입들
export interface MatchInstanceOverviewResponse extends MatchInstance { }

export interface MatchInstanceDetailResponse extends MatchInstanceDetail { } 