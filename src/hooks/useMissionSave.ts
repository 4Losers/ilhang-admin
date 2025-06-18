import { message } from 'antd';
import { MissionTemplateDetailResponse, MissionInstance, MissionPeriod, MissionPoint } from '@/services/missionService';
import { updateDetailDraftAfterSave } from '@/utils/missionDetailUtils';
import { EditModes } from '@/types/missionTemplate';

interface UseMissionSaveProps {
    templateId: number | null;
    detailDraft: MissionTemplateDetailResponse | null;
    onSave: () => Promise<MissionTemplateDetailResponse>;
    setDetailDraft: (draft: MissionTemplateDetailResponse | null) => void;
    setEditModes: (updater: (prev: EditModes) => EditModes) => void;
}

export const useMissionSave = ({
    templateId,
    detailDraft,
    onSave,
    setDetailDraft,
    setEditModes,
}: UseMissionSaveProps) => {

    // 공통 저장 후 처리 로직
    const handleSaveSuccess = async (section: keyof EditModes, successMessage: string) => {
        message.success(successMessage);
        setEditModes(prev => ({ ...prev, [section]: false }));

        const updatedDetail = await onSave();
        setDetailDraft(updateDetailDraftAfterSave(updatedDetail));
    };

    // 공통 에러 처리 로직
    const handleSaveError = (error: unknown, errorMessage: string) => {
        console.error(errorMessage, error);
        message.error(error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.');
    };

    // 상세 정보 저장
    const handleDetailSave = async () => {
        try {
            if (!templateId || !detailDraft) {
                message.error('저장할 데이터가 없습니다.');
                return;
            }

            const requestData = {
                templateId: detailDraft.templateId,
                categoryId: detailDraft.categoryId,
                title: detailDraft.title,
                description: detailDraft.description,
                type: detailDraft.type,
                thumbnailUrl: detailDraft.thumbnailUrl,
                isActive: detailDraft.isActive,
                detail: detailDraft.detail,
            };

            await import('@/services/missionService').then(({ updateMissionDetail }) =>
                updateMissionDetail(templateId, requestData)
            );

            await handleSaveSuccess('detail', '상세 정보가 저장되었습니다.');
        } catch (e) {
            handleSaveError(e, '상세 정보 저장 오류');
        }
    };

    // 인스턴스 저장
    const handleInstancesSave = async () => {
        try {
            if (!templateId || !detailDraft) {
                message.error('저장할 데이터가 없습니다.');
                return;
            }

            // instances 저장
            for (const instance of detailDraft.instances) {
                await import('@/services/missionService').then(({ updateMissionInstance }) =>
                    updateMissionInstance(instance.instanceId, {
                        ...instance,
                        templateId: templateId,
                    })
                );
            }

            await handleSaveSuccess('instances', '미션 인스턴스가 저장되었습니다.');
        } catch (e) {
            handleSaveError(e, '인스턴스 저장 오류');
        }
    };

    // 주기 저장
    const handlePeriodsSave = async () => {
        try {
            if (!templateId || !detailDraft) {
                message.error('저장할 데이터가 없습니다.');
                return;
            }

            // periods 저장
            for (const period of detailDraft.periods) {
                await import('@/services/missionService').then(({ updateMissionPeriod }) =>
                    updateMissionPeriod(period.periodId, {
                        ...period,
                        templateId: templateId,
                    })
                );
            }

            await handleSaveSuccess('periods', '미션 주기가 저장되었습니다.');
        } catch (e) {
            handleSaveError(e, '주기 저장 오류');
        }
    };

    // 포인트 저장
    const handlePointsSave = async () => {
        try {
            if (!detailDraft) {
                message.error('저장할 데이터가 없습니다.');
                return;
            }

            // points 저장
            for (const point of detailDraft.points) {
                await import('@/services/missionService').then(({ updateMissionPoint }) =>
                    updateMissionPoint(point.pointId, {
                        ...point,
                        periodId: point.periodId,
                    })
                );
            }

            await handleSaveSuccess('points', '도전금 정보가 저장되었습니다.');
        } catch (e) {
            handleSaveError(e, '포인트 저장 오류');
        }
    };

    return {
        handleDetailSave,
        handleInstancesSave,
        handlePeriodsSave,
        handlePointsSave,
    };
}; 