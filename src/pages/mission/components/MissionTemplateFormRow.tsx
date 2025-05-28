// pages/mission/components/MissionTemplateFormRow.tsx

import React from 'react';
import { Input, Select, Button, Space } from 'antd';
import { MissionCategoryResponse } from '@/services/categoryService';

const { Option } = Select;

type Props = {
    newMission: {
        title: string;
        description: string;
        categoryId: number;
        type: 'CATEGORY' | 'SEQUENTIAL' | 'MIXED';
    };
    validationError: {
        title: boolean;
        description: boolean;
        categoryId: boolean;
        type: boolean;
    };
    categories: MissionCategoryResponse[];
    onChange: (field: string, value: any) => void;
    onCreate: () => void;
    onCancel: () => void;
};

const MissionTemplateFormRow: React.FC<Props> = ({
    newMission,
    validationError,
    categories,
    onChange,
    onCreate,
    onCancel,
}) => {
    return (
        <>
            <Input
                value={newMission.title}
                onChange={(e) => onChange('title', e.target.value)}
                status={validationError.title ? 'error' : ''}
                placeholder="제목 입력"
            />
            <Input
                value={newMission.description}
                onChange={(e) => onChange('description', e.target.value)}
                status={validationError.description ? 'error' : ''}
                placeholder="설명 입력"
            />
            <Select
                value={newMission.categoryId}
                onChange={(val) => onChange('categoryId', val)}
                style={{ width: 160 }}
                status={validationError.categoryId ? 'error' : ''}
                placeholder="카테고리 선택"
            >
                {categories.map((cat) => (
                    <Option key={cat.categoryId} value={cat.categoryId}>
                        {cat.name}
                    </Option>
                ))}
            </Select>
            <Select
                value={newMission.type}
                onChange={(val) => onChange('type', val)}
                style={{ width: 140 }}
                status={validationError.type ? 'error' : ''}
            >
                <Option value="CATEGORY">CATEGORY</Option>
                <Option value="SEQUENTIAL">SEQUENTIAL</Option>
                <Option value="MIXED">MIXED</Option>
            </Select>
            <Space>
                <Button type="primary" size="small" onClick={onCreate}>
                    저장
                </Button>
                <Button danger size="small" onClick={onCancel}>
                    취소
                </Button>
            </Space>
        </>
    );
};

export default MissionTemplateFormRow;