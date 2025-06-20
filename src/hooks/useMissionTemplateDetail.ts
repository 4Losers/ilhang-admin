import { useEffect, useState } from 'react';
import { MissionTemplateDetailResponse, MissionInstance, MissionPeriod, MissionPoint } from '@/services/missionService';
import { initializeDetailDraft, updateArrayItem } from '@/utils/missionDetailUtils';

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

    // 추가 함수들
    const addInstance = () => {
        if (!detailDraft) return;

        const newInstance: MissionInstance = {
            instanceId: -Date.now(), // 임시 음수 ID
            subTitle: '',
            subDescription: '',
            orderInTemplate: detailDraft.instances.length + 1,
            nextInstanceId: null,
        };

        setDetailDraft(prev => prev ? {
            ...prev,
            instances: [...prev.instances, newInstance]
        } : null);
    };

    const addPeriod = () => {
        if (!detailDraft) return;

        const newPeriod: MissionPeriod = {
            periodId: -Date.now(), // 임시 음수 ID
            cycleId: 1,
        };

        setDetailDraft(prev => prev ? {
            ...prev,
            periods: [...prev.periods, newPeriod]
        } : null);
    };

    const addPoint = () => {
        if (!detailDraft) return;

        const newPoint: MissionPoint = {
            pointId: -Date.now(), // 임시 음수 ID
            periodId: detailDraft.periods.length > 0 ? detailDraft.periods[0].periodId : 1,
            challengePoint: 0,
        };

        setDetailDraft(prev => prev ? {
            ...prev,
            points: [...prev.points, newPoint]
        } : null);
    };

    const removeInstance = (instanceId: number) => {
        if (!detailDraft) return;

        setDetailDraft(prev => prev ? {
            ...prev,
            instances: prev.instances.filter(instance => instance.instanceId !== instanceId)
        } : null);
    };

    const removePeriod = (periodId: number) => {
        if (!detailDraft) return;

        setDetailDraft(prev => prev ? {
            ...prev,
            periods: prev.periods.filter(period => period.periodId !== periodId)
        } : null);
    };

    const removePoint = (pointId: number) => {
        if (!detailDraft) return;

        setDetailDraft(prev => prev ? {
            ...prev,
            points: prev.points.filter(point => point.pointId !== pointId)
        } : null);
    };

    return {
        detailDraft,
        setDetailDraft,
        handleInstanceChange,
        handlePeriodChange,
        handlePointChange,
        handleDetailDraftFieldChange,
        resetDetailDraft,
        addInstance,
        addPeriod,
        addPoint,
        removeInstance,
        removePeriod,
        removePoint,
    };
}; 