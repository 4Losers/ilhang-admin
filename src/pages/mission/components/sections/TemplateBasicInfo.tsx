import React from 'react';
import { MissionTemplateDetailResponse } from '@/services/missionService';
import EditableField from './EditableField';

interface TemplateBasicInfoProps {
    detail: MissionTemplateDetailResponse;
    detailDraft: MissionTemplateDetailResponse | null;
    editMode: boolean;
    categories: { categoryId: number; name: string; description: string }[];
    onFieldChange: (field: keyof MissionTemplateDetailResponse, value: any) => void;
}

const TemplateBasicInfo: React.FC<TemplateBasicInfoProps> = ({
    detail,
    detailDraft,
    editMode,
    categories,
    onFieldChange
}) => {
    const getCurrentValue = (field: keyof MissionTemplateDetailResponse) => {
        return detailDraft?.[field] ?? detail[field] ?? '';
    };

    const categoryOptions = categories.map(cat => ({
        value: cat.categoryId,
        label: cat.name
    }));

    const typeOptions = [
        { value: 'CATEGORY', label: 'CATEGORY' },
        { value: 'SEQUENTIAL', label: 'SEQUENTIAL' },
        { value: 'MIXED', label: 'MIXED' }
    ];

    return (
        <div style={{ marginBottom: 16 }}>
            <EditableField
                label="제목"
                value={getCurrentValue('title')}
                editMode={editMode}
                onChange={(value) => onFieldChange('title', value)}
                type="text"
                style={{ width: 300 }}
            />

            <EditableField
                label="설명"
                value={getCurrentValue('description')}
                editMode={editMode}
                onChange={(value) => onFieldChange('description', value)}
                type="text"
                style={{ width: 400 }}
            />

            <EditableField
                label="카테고리"
                value={getCurrentValue('categoryId')}
                editMode={editMode}
                onChange={(value) => onFieldChange('categoryId', value)}
                type="select"
                options={categoryOptions}
                style={{ width: 200 }}
            />

            <EditableField
                label="타입"
                value={getCurrentValue('type')}
                editMode={editMode}
                onChange={(value) => onFieldChange('type', value)}
                type="select"
                options={typeOptions}
                style={{ width: 160 }}
            />
        </div>
    );
};

export default TemplateBasicInfo; 