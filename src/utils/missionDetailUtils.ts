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