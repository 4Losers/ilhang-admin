import React from 'react';
import { MissionTemplateDetailResponse } from '@/services/missionService';
import EditableField from './EditableField';

interface RelatedMissionsSectionProps {
    detail: MissionTemplateDetailResponse;
    detailDraft: MissionTemplateDetailResponse | null;
    editMode: boolean;
    onDetailDraftChange: (draft: MissionTemplateDetailResponse) => void;
}

const RelatedMissionsSection: React.FC<RelatedMissionsSectionProps> = ({
    detail,
    detailDraft,
    editMode,
    onDetailDraftChange
}) => {
    const getCurrentRelatedMissions = () => {
        const missions = detailDraft?.detail.relatedMissionIds ?? detail.detail.relatedMissionIds;
        return missions?.join(', ') ?? '';
    };

    const handleRelatedMissionsChange = (value: string) => {
        if (!detailDraft) return;

        const missionIds = value
            .split(',')
            .map((s: string) => parseInt(s.trim()) || 0)
            .filter((id: number) => id > 0);

        onDetailDraftChange({
            ...detailDraft,
            detail: {
                ...detailDraft.detail,
                relatedMissionIds: missionIds
            }
        });
    };

    return (
        <div style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
            <h4 style={{ margin: '0 0 12px 0' }}>🔗 관련 미션</h4>

            <EditableField
                label="관련 미션 ID"
                value={getCurrentRelatedMissions()}
                editMode={editMode}
                onChange={handleRelatedMissionsChange}
                type="text"
                placeholder="예: 1, 2, 3"
            />
        </div>
    );
};

export default RelatedMissionsSection; 