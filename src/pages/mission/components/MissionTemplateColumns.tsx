// pages/mission/components/MissionTemplateColumns.tsx

import { ColumnsType } from 'antd/es/table';
import { Button, Select, Switch, notification, Space } from 'antd';
import MissionTemplateFormRow from './MissionTemplateFormRow';
import MissionTemplateEditableRow from './MissionTemplateEditableRow';
import { MissionCategoryResponse } from '@/services/categoryService';
import { Mission } from '@/services/missionService';

const { Option } = Select;

type MissionWithDraft = Mission & { isNew?: boolean };

type NewMissionInput = {
    title: string;
    description: string;
    type: 'CATEGORY' | 'SEQUENTIAL' | 'MIXED';
    categoryId: number;
};

type Params = {
    categories: MissionCategoryResponse[];
    newMission: NewMissionInput;
    validationError: Record<keyof NewMissionInput, boolean>;
    editMission: NewMissionInput | null;
    editingId: number | null;
    onChangeNew: (field: string, value: any) => void;
    onChangeEdit: (field: keyof NewMissionInput, value: any) => void;
    onCreate: () => void;
    onCancelCreate: () => void;
    onSaveEdit: (id: number) => void;
    onCancelEdit: () => void;
    onClickEdit: (id: number, mission: NewMissionInput) => void;
    onToggleActive: (id: number, title: string) => void;
    onOpenDrawer: (id: number) => void;
};

export const getMissionTemplateColumns = ({
    categories,
    newMission,
    validationError,
    editMission,
    editingId,
    onChangeNew,
    onChangeEdit,
    onCreate,
    onCancelCreate,
    onSaveEdit,
    onCancelEdit,
    onClickEdit,
    onToggleActive,
    onOpenDrawer,
}: Params): ColumnsType<MissionWithDraft> => [
        {
            title: '템플릿 ID',
            dataIndex: 'templateId',
            render: (value, record) => (record.isNew ? '—' : value),
        },
        {
            title: '내용',
            key: 'content',
            render: (_, record) => {
                if (record.isNew) {
                    return (
                        <MissionTemplateFormRow
                            newMission={newMission}
                            validationError={validationError}
                            categories={categories}
                            onChange={onChangeNew}
                            onCreate={onCreate}
                            onCancel={onCancelCreate}
                        />
                    );
                }

                if (record.templateId === editingId && editMission) {
                    return (
                        <MissionTemplateEditableRow
                            editMission={editMission}
                            categories={categories}
                            onChange={onChangeEdit}
                            onSave={() => onSaveEdit(record.templateId)}
                            onCancel={onCancelEdit}
                        />
                    );
                }

                return (
                    <>
                        <div><strong>{record.title}</strong></div>
                        <div style={{ color: '#666' }}>{record.description}</div>
                        <div style={{ fontSize: 12 }}>
                            카테고리: {categories.find(c => c.categoryId === record.categoryId)?.name ?? record.categoryId} | 타입: {record.type}
                        </div>
                    </>
                );
            },
        },
        {
            title: '활성화',
            dataIndex: 'isActive',
            render: (value, record) =>
                record.isNew || editingId === record.templateId ? (
                    <span style={{ color: '#999' }}>—</span>
                ) : (
                    <Switch
                        checked={value}
                        onChange={() => onToggleActive(record.templateId, record.title)}
                    />
                ),
        },
        {
            title: '인스턴스',
            key: 'instances',
            render: (_, record) =>
                !record.isNew && (
                    <Button
                        size="small"
                        onClick={() => onOpenDrawer(record.templateId)}
                    >
                        보기
                    </Button>
                ),
        },
        {
            title: '액션',
            key: 'actions',
            render: (_, record) => {
                if (record.isNew) return null;

                if (record.templateId === editingId) return null;

                return (
                    <Button
                        size="small"
                        onClick={() =>
                            onClickEdit(record.templateId, {
                                title: record.title,
                                description: record.description,
                                categoryId: record.categoryId,
                                type: record.type,
                            })
                        }
                    >
                        수정
                    </Button>
                );
            },
        },
    ];