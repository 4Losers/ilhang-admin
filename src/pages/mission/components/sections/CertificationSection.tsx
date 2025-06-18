import React from 'react';
import { MissionTemplateDetailResponse } from '@/services/missionService';
import EditableField from './EditableField';

interface CertificationSectionProps {
    detail: MissionTemplateDetailResponse;
    detailDraft: MissionTemplateDetailResponse | null;
    editMode: boolean;
    onCertificationChange: (field: 'description' | 'deadline', value: any) => void;
}

const CertificationSection: React.FC<CertificationSectionProps> = ({
    detail,
    detailDraft,
    editMode,
    onCertificationChange
}) => {
    const getCurrentCertificationValue = (field: 'description' | 'deadline') => {
        return detailDraft?.detail.certification?.[field] ?? detail.detail.certification?.[field] ?? '';
    };

    return (
        <div style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
            <h4 style={{ margin: '0 0 12px 0' }}>🧾 인증 방법</h4>

            <EditableField
                label="설명"
                value={getCurrentCertificationValue('description')}
                editMode={editMode}
                onChange={(value) => onCertificationChange('description', value)}
                type="textarea"
                placeholder="인증 방법에 대한 설명을 입력하세요"
            />

            <EditableField
                label="마감 시각"
                value={getCurrentCertificationValue('deadline')}
                editMode={editMode}
                onChange={(value) => onCertificationChange('deadline', value)}
                type="text"
                placeholder="예: 23:59"
                style={{ width: 200 }}
            />
        </div>
    );
};

export default CertificationSection; 