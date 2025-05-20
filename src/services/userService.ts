import axiosClient from './axiosClient';

export interface User {
  userId: number;
  nickname: string;
  email: string;
  joinedAt: string;
  status: '정상' | '정지됨';
}

export interface PageInfo<T> {
  list: T[];
  pageNum: number;
  pageSize: number;
  total: number;
  pages: number;
}

export const fetchUsers = async (
  page: number = 1, // 1부터 시작
  size: number = 10 // 백엔드에서 최대 20까지 허용
): Promise<PageInfo<User>> => {
  const response = await axiosClient.get<PageInfo<User>>('/admin/users', {
    params: {
      p: page,
      s: size,
    },
  });

  const pageInfo = response.data;

  if (!pageInfo || !Array.isArray(pageInfo.list)) {
    throw new Error('사용자 목록을 불러올 수 없습니다.');
  }

  return pageInfo;
};