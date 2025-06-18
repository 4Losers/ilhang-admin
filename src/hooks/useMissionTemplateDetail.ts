import { useEffect, useState } from 'react';
import { MissionTemplateDetailResponse, MissionInstance, MissionPeriod, MissionPoint } from '@/services/missionService';
import { updateArrayItem } from '@/utils/missionUtils';
import { initializeDetailDraft } from '@/utils/missionDetailUtils';

interface UseMissionTemplateDetailProps {
    detail: MissionTemplateDetailResponse | null;
}

export const useMissionTemplateDetail = ({ detail }: UseMissionTemplateDetailProps) => {
    const [detailDraft, setDetailDraft] = useState<MissionTemplateDetailResponse | null>(null);

    // 초기화 및 동기화
    useEffect(() => {
        if (detail) {
            setDetailDraft(initializeDetailDraft(detail));
        }
    }, [detail]);

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

    // detailDraft를 원본 데이터로 복원
    const resetDetailDraft = () => {
        if (detail) {
            setDetailDraft(initializeDetailDraft(detail));
        }
    };

    return {
        detailDraft,
        setDetailDraft,
        handleInstanceChange,
        handlePeriodChange,
        handlePointChange,
        handleDetailDraftFieldChange,
        resetDetailDraft,
    };
}; 