import axiosClient from './axiosClient';
import {
  User,
  Admin,
  PageInfo,
  UserSearchParams,
  AdminSearchParams,
  UserActionRequest,
  AdminCreateRequest,
  LoginResponse,
} from '@/types/user';

// 사용자 관련 API
export const fetchUsers = async (
  page: number = 1,
  size: number = 10,
  searchParams?: UserSearchParams
): Promise<PageInfo<User>> => {
  const response = await axiosClient.get<PageInfo<User>>('/admin/users', {
    params: {
      p: page,
      s: size,
      ...searchParams,
    },
  });

  const pageInfo = response.data;
  if (!pageInfo || !Array.isArray(pageInfo.list)) {
    throw new Error('사용자 목록을 불러올 수 없습니다.');
  }

  return pageInfo;
};

export const fetchUserDetail = async (userId: number): Promise<User> => {
  const response = await axiosClient.get<User>(`/admin/users/${userId}`);
  return response.data;
};

export const updateUserStatus = async (request: UserActionRequest): Promise<void> => {
  await axiosClient.patch(`/admin/users/${request.userId}/status`, {
    action: request.action,
    reason: request.reason,
  });
};

// 관리자 관련 API
export const fetchAdmins = async (
  searchParams?: AdminSearchParams
): Promise<Admin[]> => {
  const response = await axiosClient.get<Admin[]>('/admin/accounts', {
    params: searchParams,
  });
  return response.data;
};

export const createAdmin = async (request: AdminCreateRequest): Promise<Admin> => {
  const response = await axiosClient.post<Admin>('/admin/accounts', request);
  return response.data;
};

export const deleteAdmin = async (adminId: number): Promise<void> => {
  await axiosClient.delete(`/admin/accounts/${adminId}`);
};

// 인증 관련 API
export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>('/admin/login', {
    email,
    password,
  });
  return response.data;
};

export const register = async (request: AdminCreateRequest): Promise<void> => {
  await axiosClient.post('/admin', request);
};

export const refreshToken = async (): Promise<LoginResponse> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  const response = await axiosClient.post<LoginResponse>('/auth/refresh', {
    refreshToken,
  });
  return response.data;
};