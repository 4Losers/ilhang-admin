import React from 'react';
import { MissionTemplateDetailResponse } from '@/services/missionService';
import EditableField from './EditableField';

interface ChallengeInfoSectionProps {
    detail: MissionTemplateDetailResponse;
    detailDraft: MissionTemplateDetailResponse | null;
    editMode: boolean;
    onChallengeInfoChange: (field: 'availableCycles' | 'estimatedDuration', value: any) => void;
}

const ChallengeInfoSection: React.FC<ChallengeInfoSectionProps> = ({
    detail,
    detailDraft,
    editMode,
    onChallengeInfoChange
}) => {
    const getCurrentChallengeValue = (field: 'availableCycles' | 'estimatedDuration') => {
        if (field === 'availableCycles') {
            const cycles = detailDraft?.detail.challengeInfo?.[field] ?? detail.detail.challengeInfo?.[field];
            return cycles?.join(', ') ?? '';
        }
        return detailDraft?.detail.challengeInfo?.[field] ?? detail.detail.challengeInfo?.[field] ?? '';
    };

    return (
        <div style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
            <h4 style={{ margin: '0 0 12px 0' }}>📅 도전 정보</h4>

            <EditableField
                label="가능한 주기"
                value={getCurrentChallengeValue('availableCycles')}
                editMode={editMode}
                onChange={(value) => onChallengeInfoChange('availableCycles', value.split(',').map((s: string) => s.trim()))}
                type="text"
                placeholder="예: 일, 월, 화"
            />

            <EditableField
                label="예상 소요 시간"
                value={getCurrentChallengeValue('estimatedDuration')}
                editMode={editMode}
                onChange={(value) => onChallengeInfoChange('estimatedDuration', value)}
                type="text"
                placeholder="예: 30분"
                style={{ width: 200 }}
            />
        </div>
    );
};

export default ChallengeInfoSection; 