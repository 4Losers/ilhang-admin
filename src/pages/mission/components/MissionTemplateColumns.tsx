import type { ColumnsType } from 'antd/es/table';
import { Button, Switch } from 'antd';
import MissionTemplateFormRow from './MissionTemplateFormRow';
import { MissionCategoryResponse } from '@/services/categoryService';
import { MissionTemplateView } from '@/services/missionService';
import { MISSION_STYLES } from '@/utils/missionUtils';

type MissionWithDraft = MissionTemplateView & { isNew?: boolean };

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
    onChangeNew: (field: string, value: any) => void;
    onCreate: () => void;
    onCancelCreate: () => void;
    onTitleClick: (id: number) => void;
    onToggleActive: (id: number, title: string) => void;
};

export const getMissionTemplateColumns = ({
    categories,
    newMission,
    validationError,
    onChangeNew,
    onCreate,
    onCancelCreate,
    onTitleClick,
    onToggleActive,
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

                return (
                    <>
                        <div>
                            <span
                                style={MISSION_STYLES.clickableTitle}
                                onClick={() => onTitleClick(record.templateId)}
                            >
                                {record.title}
                            </span>
                        </div>
                        <div style={MISSION_STYLES.description}>{record.description}</div>
                        <div style={MISSION_STYLES.metaInfo}>
                            카테고리: {
                                categories.find(c => c.categoryId === record.categoryId)?.name
                                ?? `ID: ${record.categoryId}`
                            }| 타입: {record.type}
                        </div>
                    </>
                );
            },
        },
        {
            title: '활성화',
            dataIndex: 'isActive',
            render: (value, record) =>
                record.isNew ? (
                    <span style={{ color: '#999' }}>—</span>
                ) : (
                    <Switch
                        checked={value}
                        onChange={() => onToggleActive(record.templateId, record.title)}
                    />
                ),
        },
    ];