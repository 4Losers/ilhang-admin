import axiosClient from '../axiosClient';
import {
    MatchCycle,
    MatchInstance,
    MatchInstanceDetail,
    MatchGroup,
    MatchTeam,
    MatchParticipant,
    CycleConfig,
    CycleConfigRequest,
    CycleConfigResponse,
    InstanceConfig,
    InstanceConfigRequest,
    MatchApplicant,
    MatchingLog,
    MatchingSettings,
    MatchingSettingsRequest,
    PageInfo,
    BackendPageResponse,
    MatchHistoryFilter,
    ApplicantFilter,
    LogFilter,
    ApiResponse,
    MatchInstanceOverviewResponse,
    MatchInstanceDetailResponse
} from './types';

// ===== 매치 주기 관리 API =====

/**
 * 매치 주기 생성
 */
export const createMatchCycle = async (request: CycleConfigRequest): Promise<void> => {
    await axiosClient.post('/admin/matches', request);
};

/**
 * 매치 주기 목록 조회 (페이지네이션)
 */
export const getMatchCycles = async (
    page: number = 1,
    size: number = 10,
    cycleName?: string
): Promise<BackendPageResponse<CycleConfigResponse>> => {
    const params: any = { p: page, s: size };
    if (cycleName) {
        params.n = cycleName;
    }

    const response = await axiosClient.get<BackendPageResponse<CycleConfigResponse>>('/admin/matches', {
        params
    });
    return response.data;
};

/**
 * 매치 주기 수정
 */
export const updateMatchCycle = async (cycleId: number, request: CycleConfigRequest): Promise<void> => {
    await axiosClient.put(`/admin/matches/${cycleId}`, request);
};

/**
 * 매치 주기 활성화/비활성화 토글
 */
export const toggleMatchCycleActive = async (cycleId: number): Promise<void> => {
    await axiosClient.patch(`/admin/matches/${cycleId}/active`);
};

// ===== 매치 현황 API =====

/**
 * 매치 개요 조회
 */
export const getMatchOverview = async (): Promise<MatchInstance[]> => {
    const response = await axiosClient.get<MatchInstance[]>('/admin/matches/overview');
    return response.data;
};

/**
 * 매치 인스턴스 목록 조회 (페이지네이션)
 */
export const getMatchInstances = async (
    page: number = 1,
    size: number = 10,
    cycleId?: number,
    cycleName?: string,
    status?: string
): Promise<BackendPageResponse<MatchInstanceOverviewResponse>> => {
    const params: any = { page, size };
    if (cycleId) params.cycleId = cycleId;
    if (cycleName) params.cycleName = cycleName;
    if (status) params.status = status;

    const response = await axiosClient.get<BackendPageResponse<MatchInstanceOverviewResponse>>('/admin/matches/instances', {
        params
    });
    return response.data;
};

/**
 * 매치 인스턴스 상세 조회
 */
export const getMatchInstanceDetail = async (instanceId: number): Promise<MatchInstanceDetailResponse> => {
    const response = await axiosClient.get<MatchInstanceDetailResponse>(`/admin/matches/instances/${instanceId}`);
    return response.data;
};

// ===== 기존 API 함수들 (호환성을 위해 유지) =====

/**
 * 매치 주기 목록 조회 (기존)
 */
export const fetchMatchCycles = async (): Promise<MatchCycle[]> => {
    const response = await axiosClient.get<ApiResponse<MatchCycle[]>>('/api/admin/matching/cycles');
    return response.data.data;
};

/**
 * 매치 회차 목록 조회 (기존)
 */
export const fetchMatchInstances = async (filter: MatchHistoryFilter = {}): Promise<PageInfo<MatchInstance>> => {
    const response = await axiosClient.get<ApiResponse<PageInfo<MatchInstance>>>('/api/admin/matching/instances', {
        params: filter
    });
    return response.data.data;
};

/**
 * 매치 회차 상세 조회 (그룹 포함) (기존)
 */
export const fetchMatchInstanceDetail = async (instanceId: number): Promise<{
    instance: MatchInstance;
    groups: MatchGroup[];
}> => {
    const response = await axiosClient.get<ApiResponse<{
        instance: MatchInstance;
        groups: MatchGroup[];
    }>>(`/api/admin/matching/instances/${instanceId}/detail`);
    return response.data.data;
};

/**
 * 매치 그룹 상세 조회 (팀 포함)
 */
export const fetchMatchGroupDetail = async (groupId: number): Promise<MatchGroup> => {
    const response = await axiosClient.get<ApiResponse<MatchGroup>>(`/api/admin/matching/groups/${groupId}`);
    return response.data.data;
};

// ===== 매치 회차 관리 API =====

/**
 * 주기 설정 목록 조회
 */
export const fetchCycleConfigs = async (page: number = 1, size: number = 10): Promise<PageInfo<CycleConfig>> => {
    const response = await axiosClient.get<ApiResponse<PageInfo<CycleConfig>>>('/api/admin/matching/cycle-configs', {
        params: { page, size }
    });
    return response.data.data;
};

/**
 * 주기 설정 생성
 */
export const createCycleConfig = async (request: CycleConfigRequest): Promise<CycleConfig> => {
    const response = await axiosClient.post<ApiResponse<CycleConfig>>('/api/admin/matching/cycle-configs', request);
    return response.data.data;
};

/**
 * 주기 설정 수정
 */
export const updateCycleConfig = async (configId: number, request: Partial<CycleConfigRequest>): Promise<CycleConfig> => {
    const response = await axiosClient.put<ApiResponse<CycleConfig>>(`/api/admin/matching/cycle-configs/${configId}`, request);
    return response.data.data;
};

/**
 * 주기 설정 활성화/비활성화
 */
export const toggleCycleConfigStatus = async (configId: number): Promise<CycleConfig> => {
    const response = await axiosClient.patch<ApiResponse<CycleConfig>>(`/api/admin/matching/cycle-configs/${configId}/toggle`);
    return response.data.data;
};

/**
 * 주기 설정 삭제
 */
export const deleteCycleConfig = async (configId: number): Promise<void> => {
    await axiosClient.delete(`/api/admin/matching/cycle-configs/${configId}`);
};

/**
 * 회차 설정 목록 조회
 */
export const fetchInstanceConfigs = async (cycleId?: number, page: number = 1, size: number = 10): Promise<PageInfo<InstanceConfig>> => {
    const response = await axiosClient.get<ApiResponse<PageInfo<InstanceConfig>>>('/api/admin/matching/instance-configs', {
        params: { cycleId, page, size }
    });
    return response.data.data;
};

/**
 * 회차 설정 생성
 */
export const createInstanceConfig = async (request: InstanceConfigRequest): Promise<InstanceConfig> => {
    const response = await axiosClient.post<ApiResponse<InstanceConfig>>('/api/admin/matching/instance-configs', request);
    return response.data.data;
};

/**
 * 회차 설정 수정
 */
export const updateInstanceConfig = async (configId: number, request: Partial<InstanceConfigRequest>): Promise<InstanceConfig> => {
    const response = await axiosClient.put<ApiResponse<InstanceConfig>>(`/api/admin/matching/instance-configs/${configId}`, request);
    return response.data.data;
};

/**
 * 회차 설정 삭제
 */
export const deleteInstanceConfig = async (configId: number): Promise<void> => {
    await axiosClient.delete(`/api/admin/matching/instance-configs/${configId}`);
};

// ===== 신청자 관리 API =====

/**
 * 신청자 목록 조회
 */
export const fetchMatchApplicants = async (filter: ApplicantFilter = {}): Promise<PageInfo<MatchApplicant>> => {
    const response = await axiosClient.get<ApiResponse<PageInfo<MatchApplicant>>>('/api/admin/matching/applicants', {
        params: filter
    });
    return response.data.data;
};

/**
 * 신청자 상태 변경
 */
export const updateApplicantStatus = async (applicantId: number, status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED'): Promise<MatchApplicant> => {
    const response = await axiosClient.patch<ApiResponse<MatchApplicant>>(`/api/admin/matching/applicants/${applicantId}/status`, {
        status
    });
    return response.data.data;
};

/**
 * 신청자 수동 그룹 지정
 */
export const assignApplicantToGroup = async (applicantId: number, groupId: number): Promise<MatchApplicant> => {
    const response = await axiosClient.patch<ApiResponse<MatchApplicant>>(`/api/admin/matching/applicants/${applicantId}/assign`, {
        groupId
    });
    return response.data.data;
};

// ===== 매칭 로그 API =====

/**
 * 매칭 로그 목록 조회
 */
export const fetchMatchingLogs = async (filter: LogFilter = {}): Promise<PageInfo<MatchingLog>> => {
    const response = await axiosClient.get<ApiResponse<PageInfo<MatchingLog>>>('/api/admin/matching/logs', {
        params: filter
    });
    return response.data.data;
};

// ===== 설정 API =====

/**
 * 매칭 설정 조회
 */
export const fetchMatchingSettings = async (cycleId: number): Promise<MatchingSettings> => {
    const response = await axiosClient.get<ApiResponse<MatchingSettings>>(`/api/admin/matching/settings/${cycleId}`);
    return response.data.data;
};

/**
 * 매칭 설정 저장
 */
export const saveMatchingSettings = async (cycleId: number, request: MatchingSettingsRequest): Promise<MatchingSettings> => {
    const response = await axiosClient.put<ApiResponse<MatchingSettings>>(`/api/admin/matching/settings/${cycleId}`, request);
    return response.data.data;
};

// ===== 매칭 관리 API =====

/**
 * 매치 그룹 취소
 */
export const cancelMatchGroup = async (groupId: number, reason?: string): Promise<void> => {
    await axiosClient.post(`/api/admin/matching/groups/${groupId}/cancel`, { reason });
};

/**
 * 매치 팀 취소
 */
export const cancelMatchTeam = async (teamId: number, reason?: string): Promise<void> => {
    await axiosClient.post(`/api/admin/matching/teams/${teamId}/cancel`, { reason });
};

/**
 * 참가자 드롭
 */
export const dropParticipant = async (participantId: number, reason?: string): Promise<void> => {
    await axiosClient.post(`/api/admin/matching/participants/${participantId}/drop`, { reason });
};

/**
 * 수동 매칭 실행
 */
export const executeManualMatching = async (instanceId: number): Promise<void> => {
    await axiosClient.post(`/api/admin/matching/instances/${instanceId}/manual-match`);
};

// ===== 기존 호환성 함수들 =====

export const fetchMatchings = async (params: { page: number; size: number } = { page: 1, size: 10 }) => {
    return getMatchCycles(params.page, params.size);
};

export const fetchMatchOverview = async () => {
    return getMatchOverview();
};

export const fetchInstanceDetailWithGroups = async (instanceId: number) => {
    return getMatchInstanceDetail(instanceId);
};

export type Matching = CycleConfig;
export type MatchingInstance = MatchInstance; 