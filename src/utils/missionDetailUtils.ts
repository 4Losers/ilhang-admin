import { MissionTemplateDetailResponse } from '@/services/missionService';

/**
 * detailDraft를 초기화하는 함수
 * @param detail 원본 detail 데이터
 * @returns 초기화된 detailDraft
 */
export const initializeDetailDraft = (detail: MissionTemplateDetailResponse): MissionTemplateDetailResponse => {
    return {
        ...detail,
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
};

/**
 * 저장 후 detailDraft를 업데이트하는 함수
 * @param updatedDetail 업데이트된 detail 데이터
 * @returns 업데이트된 detailDraft
 */
export const updateDetailDraftAfterSave = (updatedDetail: MissionTemplateDetailResponse): MissionTemplateDetailResponse => {
    return initializeDetailDraft(updatedDetail);
};

/**
 * 배열에서 특정 ID를 가진 항목의 특정 필드를 업데이트하는 함수
 * @param array 업데이트할 배열
 * @param idField ID 필드명
 * @param id 찾을 ID 값
 * @param field 업데이트할 필드명
 * @param value 새로운 값
 * @returns 업데이트된 배열
 */
export const updateArrayItem = <T extends Record<string, any>>(
    array: T[],
    idField: keyof T,
    id: any,
    field: keyof T,
    value: any
): T[] => {
    return array.map(item =>
        item[idField] === id ? { ...item, [field]: value } : item
    );
}; 