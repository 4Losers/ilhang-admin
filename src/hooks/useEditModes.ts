import { useState } from 'react';
import { EditModes } from '@/types/missionTemplate';

export const useEditModes = () => {
    const [editModes, setEditModes] = useState<EditModes>({
        detail: false,
        instances: false,
        periods: false,
        points: false,
    });

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
    };

    // 모든 편집 모드 초기화
    const resetAllEditModes = () => {
        setEditModes({
            detail: false,
            instances: false,
            periods: false,
            points: false,
        });
    };

    return {
        editModes,
        setEditModes,
        toggleEditMode,
        cancelEditMode,
        resetAllEditModes,
    };
};

// 타입 재export
export type { EditModes }; 