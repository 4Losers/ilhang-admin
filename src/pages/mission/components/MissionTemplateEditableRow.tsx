// pages/mission/components/MissionTemplateEditableRow.tsx

import React from 'react';
import { Input, Select, Button, Space } from 'antd';
import { MissionCategoryResponse } from '@/services/categoryService';

const { Option } = Select;

type EditMissionInput = {
    title: string;
    description: string;
    categoryId: number;
    type: 'CATEGORY' | 'SEQUENTIAL' | 'MIXED';
};

type Props = {
    editMission: EditMissionInput;
    categories: MissionCategoryResponse[];
    onChange: (field: keyof EditMissionInput, value: any) => void;
    onSave: () => void;
    onCancel: () => void;
};

const MissionTemplateEditableRow: React.FC<Props> = ({
    editMission,
    categories,
    onChange,
    onSave,
    onCancel,
}) => {
    return (
        <>
            <Input
                value={editMission.title}
                onChange={(e) => onChange('title', e.target.value)}
                placeholder="제목 입력"
            />
            <Input
                value={editMission.description}
                onChange={(e) => onChange('description', e.target.value)}
                placeholder="설명 입력"
            />
            <Select
                value={editMission.categoryId}
                onChange={(val) => onChange('categoryId', val)}
                style={{ width: 160 }}
            >
                {categories.map((cat) => (
                    <Option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                    </Option>
                ))}
            </Select>
            <Select
                value={editMission.type}
                onChange={(val) => onChange('type', val)}
                style={{ width: 140 }}
            >
                <Option value="CATEGORY">CATEGORY</Option>
                <Option value="SEQUENTIAL">SEQUENTIAL</Option>
                <Option value="MIXED">MIXED</Option>
            </Select>
            <Space>
                <Button type="primary" size="small" onClick={onSave}>
                    저장
                </Button>
                <Button size="small" onClick={onCancel}>
                    취소
                </Button>
            </Space>
        </>
    );
};

export default MissionTemplateEditableRow;