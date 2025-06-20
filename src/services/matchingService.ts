import axiosClient from './axiosClient';

export interface Matching {
    cycleId: number;
    cycleName: string;
    baseStartTime: string;
    instanceIntervalMinutes: number;
    applicationCloseMinutes: number;
    matchingExecMinutes: number;
    matchStartMinutes: number;
    matchDurationMinutes: number;
    description: string;
    active: boolean;
}

export interface MatchingInstance {
    instanceId: number;
    cycleId: number;
    startTime: string;
    endTime: string;
    status: 'RECRUITING' | 'MATCHING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
    participantCount: number;
    teamCount: number;
}

export interface Team {
    teamId: number;
    instanceId: number;
    teamName: string;
    memberCount: number;
    members: TeamMember[];
}

export interface TeamMember {
    userId: number;
    username: string;
    profileImage?: string;
    joinedAt: string;
}

export interface CreateMatchingRequest {
    cycleName: string;
    baseStartTime: string;
    instanceIntervalMinutes: number;
    applicationCloseMinutes: number;
    matchingExecMinutes: number;
    matchStartMinutes: number;
    matchDurationMinutes: number;
    description: string;
    defaultLifePoint: number;
    active: boolean;
}

export interface UpdateMatchingRequest extends Partial<CreateMatchingRequest> {
    active?: boolean;
}

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

// 매칭 주기 목록 조회
export const fetchMatchings = async (params?: {
    page?: number;
    size?: number;
    sort?: string;
}): Promise<PageResponse<Matching>> => {
    const queryParams = {
        pageNum: params?.page,
        pageSize: params?.size,
        sort: params?.sort,
    };
    const response = await axiosClient.get<BackendPageResponse<Matching>>('/admin/matches', { params: queryParams });
    const backendData = response.data;

    const transformedData: PageResponse<Matching> = {
        content: backendData.list,
        pageable: {
            pageNumber: backendData.pageNum,
            pageSize: backendData.pageSize,
        },
        totalElements: backendData.total,
        totalPages: backendData.pages,
        last: backendData.isLastPage,
        first: backendData.isFirstPage,
        size: backendData.size,
        number: backendData.pageNum,
    };
    console.log('✅ 매칭 주기 목록:', transformedData);
    return transformedData;
};

// 매칭 주기 생성
export const createMatching = async (data: CreateMatchingRequest): Promise<Matching> => {
    const response = await axiosClient.post<Matching>('/admin/matches', data);
    console.log('✅ 매칭 주기 생성:', response.data);
    return response.data;
};

// 매칭 주기 수정
export const updateMatching = async (cycleId: number, data: UpdateMatchingRequest): Promise<Matching> => {
    const response = await axiosClient.put<Matching>(`/admin/matches/${cycleId}`, data);
    console.log('✅ 매칭 주기 수정:', response.data);
    return response.data;
};

// 매칭 주기 삭제
export const deleteMatching = async (cycleId: number): Promise<void> => {
    await axiosClient.delete(`/admin/matches/${cycleId}`);
    console.log('✅ 매칭 주기 삭제 완료:', cycleId);
};

// 매칭 주기 활성화/비활성화 토글
export const toggleMatchingActive = async (cycleId: number): Promise<Matching> => {
    const response = await axiosClient.patch<Matching>(`/admin/matches/${cycleId}/active`);
    console.log('✅ 매칭 주기 활성화 상태 변경:', response.data);
    return response.data;
};

// 특정 주기의 매칭 인스턴스 목록 조회
export const fetchMatchingInstances = async (cycleId: number, params?: {
    page?: number;
    size?: number;
    sort?: string;
}): Promise<PageResponse<MatchingInstance>> => {
    const queryParams = {
        pageNum: params?.page,
        pageSize: params?.size,
        sort: params?.sort,
    };
    const response = await axiosClient.get<BackendPageResponse<MatchingInstance>>(`/admin/matches/${cycleId}/instances`, { params: queryParams });
    const backendData = response.data;

    const transformedData: PageResponse<MatchingInstance> = {
        content: backendData.list,
        pageable: {
            pageNumber: backendData.pageNum,
            pageSize: backendData.pageSize,
        },
        totalElements: backendData.total,
        totalPages: backendData.pages,
        last: backendData.isLastPage,
        first: backendData.isFirstPage,
        size: backendData.size,
        number: backendData.pageNum,
    };
    console.log('✅ 매칭 인스턴스 목록:', transformedData);
    return transformedData;
};

// 특정 주기의 팀 구성 조회
export const fetchMatchingTeams = async (cycleId: number, params?: {
    page?: number;
    size?: number;
    sort?: string;
}): Promise<PageResponse<Team>> => {
    const queryParams = {
        pageNum: params?.page,
        pageSize: params?.size,
        sort: params?.sort,
    };
    const response = await axiosClient.get<BackendPageResponse<Team>>(`/admin/matches/${cycleId}/teams`, { params: queryParams });
    const backendData = response.data;
    const transformedData: PageResponse<Team> = {
        content: backendData.list,
        pageable: {
            pageNumber: backendData.pageNum,
            pageSize: backendData.pageSize,
        },
        totalElements: backendData.total,
        totalPages: backendData.pages,
        last: backendData.isLastPage,
        first: backendData.isFirstPage,
        size: backendData.size,
        number: backendData.pageNum,
    };
    console.log('✅ 팀 구성 목록:', transformedData);
    return transformedData;
};

// 특정 인스턴스의 상세 정보 조회 (추가 API가 있는 경우)
export const fetchInstanceDetail = async (instanceId: number): Promise<MatchingInstance> => {
    const response = await axiosClient.get<MatchingInstance>(`/admin/matches/instance/${instanceId}/detail`);
    console.log('✅ 인스턴스 상세 정보:', response.data);
    return response.data;
};