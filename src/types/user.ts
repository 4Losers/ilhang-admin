// 사용자 관련 타입 정의
export interface User {
    userId: number;
    nickname: string;
    email: string;
    joinedAt: string;
    status: UserStatus;
    profileImage?: string;
    lastLoginAt?: string;
    totalMissions?: number;
    completedMissions?: number;
}

export interface Admin {
    id: number;
    name: string;
    email: string;
    role: AdminRole;
    createdAt: string;
    lastLoginAt?: string;
    isActive: boolean;
}

export type UserStatus = '정상' | '정지됨' | '휴면';
export type AdminRole = '최고 관리자' | '일반 운영자';

export interface PageInfo<T> {
    list: T[];
    pageNum: number;
    pageSize: number;
    total: number;
    pages: number;
}

export interface UserSearchParams {
    keyword?: string;
    status?: UserStatus;
    startDate?: string;
    endDate?: string;
}

export interface AdminSearchParams {
    keyword?: string;
    role?: AdminRole;
    isActive?: boolean;
}

// API 응답 타입
export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: AdminRole;
    };
}

export interface UserActionRequest {
    userId: number;
    action: 'block' | 'unblock' | 'delete';
    reason?: string;
}

export interface AdminCreateRequest {
    name: string;
    email: string;
    password: string;
    role: AdminRole;
} 