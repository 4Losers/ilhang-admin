// src/services/categoryService.ts
import axiosClient from './axiosClient';

// 카테고리 응답 타입
export interface MissionCategoryResponse {
    categoryId: number;
    name: string;
    description: string;
}

// 카테고리 생성/수정 요청 타입
export interface MissionCategoryRequest {
    name: string;
    description: string;
}

// 카테고리 전체 조회
export const fetchCategories = async (): Promise<MissionCategoryResponse[]> => {
    const res = await axiosClient.get<MissionCategoryResponse[]>('/admin/missions/categories');
    return res.data;
};

// 카테고리 생성
export const createCategory = async (req: MissionCategoryRequest): Promise<void> => {
    await axiosClient.post('/admin/missions/categories', req);
};

// 카테고리 수정
export const updateCategory = async (
    categoryId: number,
    req: MissionCategoryRequest
): Promise<void> => {
    await axiosClient.put(`/admin/missions/categories/${categoryId}`, req);
};