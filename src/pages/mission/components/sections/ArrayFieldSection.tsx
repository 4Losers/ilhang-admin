import { Input, Space } from 'antd';
import React from 'react';
import { MissionTemplateDetailResponse } from '@/services/missionService';

interface ArrayFieldSectionProps {
    title: string;
    field: 'goodPoints' | 'howToProceed';
    detail: MissionTemplateDetailResponse;
    detailDraft: MissionTemplateDetailResponse | null;
    editMode: boolean;
    onArrayFieldChange: (field: 'goodPoints' | 'howToProceed', index: number, value: string) => void;
    onArrayFieldAdd: (field: 'goodPoints' | 'howToProceed') => void;
}

const ArrayFieldSection: React.FC<ArrayFieldSectionProps> = ({
    title,
    field,
    detail,
    detailDraft,
    editMode,
    onArrayFieldChange,
    onArrayFieldAdd
}) => {
    const currentValues = detailDraft?.detail[field] || detail.detail[field] || [];

    return (
        <div style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h4 style={{ margin: 0 }}>{title}</h4>
                {editMode && (
                    <button
                        onClick={() => onArrayFieldAdd(field)}
                        style={{
                            background: 'none',
                            border: '1px solid #d9d9d9',
                            borderRadius: 4,
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        ➕ 추가
                    </button>
                )}
            </div>

            {editMode ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                    {currentValues.map((value, idx) => (
                        <Input
                            key={idx}
                            value={value}
                            onChange={(e) => onArrayFieldChange(field, idx, e.target.value)}
                            style={{ width: '100%' }}
                            placeholder={`${title} ${idx + 1}`}
                        />
                    ))}
                </Space>
            ) : (
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {currentValues.map((value, idx) => (
                        <li key={idx}>{value}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ArrayFieldSection; 