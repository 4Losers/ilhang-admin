import { useState, useEffect } from 'react';
import { message } from 'antd';
import { MatchingSettings, MatchingSettingsRequest, CycleConfig } from '../../../services/matching/types';
import { fetchMatchingSettings, saveMatchingSettings, fetchCycleConfigs } from '../../../services/matching/api';

export const useMatchingSettings = () => {
    // 상태 관리
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState<MatchingSettings | null>(null);
    const [cycles, setCycles] = useState<CycleConfig[]>([]);
    const [selectedCycleId, setSelectedCycleId] = useState<number | null>(null);

    // 데이터 로드 함수들
    const loadCycles = async () => {
        try {
            const data = await fetchCycleConfigs(1, 100);
            setCycles(data.content);
            if (data.content.length > 0 && !selectedCycleId) {
                setSelectedCycleId(data.content[0].id);
            }
        } catch (error) {
            console.error('주기 목록 로드 실패:', error);
            message.error('주기 목록을 불러오는데 실패했습니다.');
        }
    };

    const loadSettings = async (cycleId: number) => {
        try {
            setLoading(true);
            const data = await fetchMatchingSettings(cycleId);
            setSettings(data);
            return data;
        } catch (error) {
            console.error('설정 로드 실패:', error);
            message.error('설정을 불러오는데 실패했습니다.');
            // 기본값 반환
            return {
                matchingStrategy: 'SUCCESS_RATE',
                teamSize: {
                    min: 2,
                    max: 6,
                    preferred: 4
                },
                priorityConditions: {
                    highSuccessRate: true,
                    similarLevel: true,
                    timeZone: false,
                    language: false
                },
                autoMatching: {
                    enabled: true,
                    delayMinutes: 30,
                    maxRetries: 3
                }
            };
        } finally {
            setLoading(false);
        }
    };

    // 이벤트 핸들러들
    const handleCycleChange = async (cycleId: number) => {
        setSelectedCycleId(cycleId);
        return await loadSettings(cycleId);
    };

    const handleSave = async (values: any) => {
        if (!selectedCycleId) {
            message.warning('먼저 주기를 선택해주세요.');
            return false;
        }

        try {
            setSaving(true);
            const request: MatchingSettingsRequest = {
                cycleId: selectedCycleId,
                ...values
            };

            await saveMatchingSettings(selectedCycleId, request);
            message.success('설정이 저장되었습니다.');

            // 저장된 설정 다시 로드
            await loadSettings(selectedCycleId);
            return true;
        } catch (error) {
            console.error('설정 저장 실패:', error);
            message.error('설정 저장에 실패했습니다.');
            return false;
        } finally {
            setSaving(false);
        }
    };

    const handleReset = async () => {
        if (selectedCycleId) {
            return await loadSettings(selectedCycleId);
        }
        message.info('설정이 초기화되었습니다.');
        return null;
    };

    // 초기 데이터 로드
    useEffect(() => {
        loadCycles();
    }, []);

    useEffect(() => {
        if (selectedCycleId) {
            loadSettings(selectedCycleId);
        }
    }, [selectedCycleId]);

    return {
        // 상태
        loading,
        saving,
        settings,
        cycles,
        selectedCycleId,

        // 핸들러
        handleCycleChange,
        handleSave,
        handleReset,
    };
}; 