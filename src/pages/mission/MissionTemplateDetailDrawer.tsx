import { Drawer, message, Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import {
    updateMissionTemplateWithDetail,
    MissionTemplateDetailResponse,
    MissionInstance,
    MissionPeriod,
    MissionPoint
} from '@/services/missionService';
import { updateArrayItem } from '@/utils/missionUtils';
import MissionDetailSection from './components/MissionDetailSection';
import MissionInstanceSection from './components/MissionInstanceSection';
import MissionPeriodSection from './components/MissionPeriodSection';
import MissionPointSection from './components/MissionPointSection';

interface Props {
    open: boolean;
    onClose: () => void;
    templateId: number | null;
    loading: boolean;
    detail: MissionTemplateDetailResponse | null;
    categories: { categoryId: number; name: string; description: string }[];
    onSave: () => Promise<MissionTemplateDetailResponse>;
}

// 각 섹션별 편집 모드 타입
interface EditModes {
    detail: boolean;
    instances: boolean;
    periods: boolean;
    points: boolean;
}

const MissionTemplateDetailDrawer = ({
    open,
    onClose,
    templateId,
    loading,
    detail,
    categories,
    onSave,
}: Props) => {
    // 각 섹션별 편집 모드 상태
    const [editModes, setEditModes] = useState<EditModes>({
        detail: false,
        instances: false,
        periods: false,
        points: false,
    });

    const [detailDraft, setDetailDraft] = useState<MissionTemplateDetailResponse | null>(null);

    // 초기화 및 동기화
    useEffect(() => {
        if (detail) {
            setDetailDraft({
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
            });
        }
    }, [detail]);

    // 편집 모드 토글 함수
    const toggleEditMode = (section: keyof EditModes) => {
        setEditModes(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    // 편집 모드 취소 함수
    const cancelEditMode = (section: keyof EditModes) => {
        setEditModes(prev => ({
            ...prev,
            [section]: false
        }));

        // 원본 데이터로 복원
        if (detail) {
            setDetailDraft({
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
            });
        }
    };

    // 핸들러 함수들
    const handleInstanceChange = (id: number, field: keyof MissionInstance, value: any) => {
        if (!detailDraft) return;

        setDetailDraft(prev => prev ? {
            ...prev,
            instances: updateArrayItem(prev.instances, 'instanceId', id, field, value)
        } : null);
    };

    const handlePeriodChange = (id: number, field: keyof MissionPeriod, value: any) => {
        if (!detailDraft) return;

        setDetailDraft(prev => prev ? {
            ...prev,
            periods: updateArrayItem(prev.periods, 'periodId', id, field, value)
        } : null);
    };

    const handlePointChange = (id: number, field: keyof MissionPoint, value: any) => {
        if (!detailDraft) return;

        setDetailDraft(prev => prev ? {
            ...prev,
            points: updateArrayItem(prev.points, 'pointId', id, field, value)
        } : null);
    };

    const handleDetailDraftFieldChange = (field: keyof MissionTemplateDetailResponse, value: any) => {
        if (!detailDraft) return;
        setDetailDraft(prev => prev ? { ...prev, [field]: value } : null);
    };

    // 각 섹션별 저장 함수들
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

            message.success('상세 정보가 저장되었습니다.');
            setEditModes(prev => ({ ...prev, detail: false }));

            const updatedDetail = await onSave();
            setDetailDraft({
                ...updatedDetail,
                detail: {
                    goodPoints: updatedDetail.detail.goodPoints || [],
                    howToProceed: updatedDetail.detail.howToProceed || [],
                    certification: {
                        description: updatedDetail.detail.certification?.description || '',
                        deadline: updatedDetail.detail.certification?.deadline || '',
                        examples: updatedDetail.detail.certification?.examples || [],
                    },
                    challengeInfo: {
                        availableCycles: updatedDetail.detail.challengeInfo?.availableCycles || [],
                        estimatedDuration: updatedDetail.detail.challengeInfo?.estimatedDuration || '',
                    },
                    relatedMissionIds: updatedDetail.detail.relatedMissionIds || [],
                },
            });
        } catch (e) {
            message.error(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
        }
    };

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

            message.success('미션 인스턴스가 저장되었습니다.');
            setEditModes(prev => ({ ...prev, instances: false }));

            const updatedDetail = await onSave();
            setDetailDraft({
                ...updatedDetail,
                detail: {
                    goodPoints: updatedDetail.detail.goodPoints || [],
                    howToProceed: updatedDetail.detail.howToProceed || [],
                    certification: {
                        description: updatedDetail.detail.certification?.description || '',
                        deadline: updatedDetail.detail.certification?.deadline || '',
                        examples: updatedDetail.detail.certification?.examples || [],
                    },
                    challengeInfo: {
                        availableCycles: updatedDetail.detail.challengeInfo?.availableCycles || [],
                        estimatedDuration: updatedDetail.detail.challengeInfo?.estimatedDuration || '',
                    },
                    relatedMissionIds: updatedDetail.detail.relatedMissionIds || [],
                },
            });
        } catch (e) {
            console.error('인스턴스 저장 오류:', e);
            message.error(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
        }
    };

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

            message.success('미션 주기가 저장되었습니다.');
            setEditModes(prev => ({ ...prev, periods: false }));

            const updatedDetail = await onSave();
            setDetailDraft({
                ...updatedDetail,
                detail: {
                    goodPoints: updatedDetail.detail.goodPoints || [],
                    howToProceed: updatedDetail.detail.howToProceed || [],
                    certification: {
                        description: updatedDetail.detail.certification?.description || '',
                        deadline: updatedDetail.detail.certification?.deadline || '',
                        examples: updatedDetail.detail.certification?.examples || [],
                    },
                    challengeInfo: {
                        availableCycles: updatedDetail.detail.challengeInfo?.availableCycles || [],
                        estimatedDuration: updatedDetail.detail.challengeInfo?.estimatedDuration || '',
                    },
                    relatedMissionIds: updatedDetail.detail.relatedMissionIds || [],
                },
            });
        } catch (e) {
            console.error('주기 저장 오류:', e);
            message.error(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
        }
    };

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

            message.success('도전금 정보가 저장되었습니다.');
            setEditModes(prev => ({ ...prev, points: false }));

            const updatedDetail = await onSave();
            setDetailDraft({
                ...updatedDetail,
                detail: {
                    goodPoints: updatedDetail.detail.goodPoints || [],
                    howToProceed: updatedDetail.detail.howToProceed || [],
                    certification: {
                        description: updatedDetail.detail.certification?.description || '',
                        deadline: updatedDetail.detail.certification?.deadline || '',
                        examples: updatedDetail.detail.certification?.examples || [],
                    },
                    challengeInfo: {
                        availableCycles: updatedDetail.detail.challengeInfo?.availableCycles || [],
                        estimatedDuration: updatedDetail.detail.challengeInfo?.estimatedDuration || '',
                    },
                    relatedMissionIds: updatedDetail.detail.relatedMissionIds || [],
                },
            });
        } catch (e) {
            console.error('포인트 저장 오류:', e);
            message.error(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다.');
        }
    };

    if (!open || !detail) return null;

    return (
        <Drawer
            title="미션 상세 보기"
            placement="right"
            width={600}
            onClose={onClose}
            open={open}
        >
            {loading || !detail ? (
                <p>불러오는 중...</p>
            ) : (
                <>
                    <MissionDetailSection
                        detail={detail}
                        detailDraft={detailDraft}
                        editMode={editModes.detail}
                        onDetailDraftChange={setDetailDraft}
                        categories={categories}
                        onFieldChange={handleDetailDraftFieldChange}
                        onEditToggle={() => toggleEditMode('detail')}
                        onSave={handleDetailSave}
                        onCancel={() => cancelEditMode('detail')}
                    />

                    <MissionInstanceSection
                        instances={detailDraft?.instances || []}
                        editMode={editModes.instances}
                        templateId={templateId}
                        onInstanceChange={handleInstanceChange}
                        onEditToggle={() => toggleEditMode('instances')}
                        onSave={handleInstancesSave}
                        onCancel={() => cancelEditMode('instances')}
                    />

                    <MissionPeriodSection
                        periods={detailDraft?.periods || []}
                        editMode={editModes.periods}
                        templateId={templateId}
                        onPeriodChange={handlePeriodChange}
                        onEditToggle={() => toggleEditMode('periods')}
                        onSave={handlePeriodsSave}
                        onCancel={() => cancelEditMode('periods')}
                    />

                    <MissionPointSection
                        points={detailDraft?.points || []}
                        editMode={editModes.points}
                        onPointChange={handlePointChange}
                        onEditToggle={() => toggleEditMode('points')}
                        onSave={handlePointsSave}
                        onCancel={() => cancelEditMode('points')}
                    />
                </>
            )}
        </Drawer>
    );
};

export default MissionTemplateDetailDrawer; 