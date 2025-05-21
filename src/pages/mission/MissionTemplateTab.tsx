import { useEffect, useMemo, useState, useCallback } from 'react';
import {
    Table,
    Button,
    notification,
    Switch,
    Input,
    Select,
    Space,
} from 'antd';
import { fetchMissions, Mission, createMissionTemplate, toggleMissionActive } from '@/services/missionService';
import { MissionCategoryResponse } from '@/services/categoryService';
import MissionInstanceDrawer from './MissionInstanceDrawer';
import type { ColumnsType } from 'antd/es/table';

const { Option } = Select;

type MissionWithDraft = Mission & { isNew?: boolean };
type Props = {
    categories: MissionCategoryResponse[];
};

type NewMissionInput = {
    title: string;
    description: string;
    type: 'CATEGORY' | 'SEQUENTIAL' | 'MIXED';
    categoryId: number;
};

const MissionTemplateTab = ({ categories }: Props) => {
    const [validationError, setValidationError] = useState({
        title: false,
        description: false,
        categoryId: false,
        type: false,
    });

    const [missions, setMissions] = useState<Mission[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newMission, setNewMission] = useState<NewMissionInput>({
        title: '',
        description: '',
        type: 'CATEGORY',
        categoryId: 1,
    });
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

    const categoryMap = useMemo(
        () => Object.fromEntries(categories.map((c) => [c.categoryId, c.name])),
        [categories]
    );

    const load = useCallback(async () => {
        try {
            const data = await fetchMissions();
            setMissions(data);
        } catch (e) {
            console.error('미션 불러오기 실패:', e);
            notification.error({
                message: '미션 불러오기 실패',
                description: '서버에서 미션 템플릿 목록을 가져오는 데 실패했습니다.',
            });
        }
    }, []);

    const handleCreate = async () => {
        const errors = {
            title: !newMission.title.trim(),
            description: !newMission.description.trim(),
            categoryId: !newMission.categoryId,
            type: !newMission.type,
        };

        const hasError = Object.values(errors).some(Boolean);
        setValidationError(errors);

        if (hasError) {
            notification.warning({
                message: '입력값 확인',
                description: '모든 항목을 입력해주세요.',
            });
            return;
        }

        try {
            await createMissionTemplate(newMission);
            notification.success({
                message: '미션 템플릿 생성 완료',
                description: `'${newMission.title}' 템플릿이 성공적으로 추가되었습니다.`,
            });
            setIsCreating(false);
            setNewMission({ title: '', description: '', type: 'CATEGORY', categoryId: 1 });
            setValidationError({ title: false, description: false, categoryId: false, type: false });
            load();
        } catch (e) {
            console.error(e);
            notification.error({
                message: '템플릿 생성 실패',
                description: '서버 요청 중 문제가 발생했습니다.',
            });
        }
    };

    useEffect(() => {
        load();
    }, [load]);

    const displayData: MissionWithDraft[] = isCreating
        ? [{ templateId: -1, isNew: true, ...newMission } as MissionWithDraft, ...missions]
        : missions;

    const columns: ColumnsType<MissionWithDraft> = [
        {
            title: '템플릿 ID',
            dataIndex: 'templateId',
            render: (value, record) => (record.isNew ? '—' : value),
        },
        {
            title: '제목',
            dataIndex: 'title',
            render: (value, record) =>
                record.isNew ? (
                    <Input
                        value={newMission.title}
                        onChange={(e) => setNewMission({ ...newMission, title: e.target.value })}
                        status={validationError.title ? 'error' : ''}
                    />
                ) : (
                    value
                ),
        },
        {
            title: '설명',
            dataIndex: 'description',
            render: (value, record) =>
                record.isNew ? (
                    <Input
                        value={newMission.description}
                        onChange={(e) => setNewMission({ ...newMission, description: e.target.value })}
                        status={validationError.description ? 'error' : ''}
                    />
                ) : (
                    value
                ),
        },
        {
            title: '카테고리',
            dataIndex: 'categoryId',
            render: (value, record) =>
                record.isNew ? (
                    <Select
                        value={newMission.categoryId}
                        onChange={(val) => setNewMission({ ...newMission, categoryId: val })}
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
                ) : (
                    categoryMap[value] ?? `카테고리 ID ${value}`
                ),
        },
        {
            title: '타입',
            dataIndex: 'type',
            render: (value, record) =>
                record.isNew ? (
                    <Select
                        value={newMission.type}
                        onChange={(val) => setNewMission({ ...newMission, type: val as NewMissionInput['type'] })}
                        style={{ width: 140 }}
                        status={validationError.type ? 'error' : ''}
                    >
                        <Option value="CATEGORY">CATEGORY</Option>
                        <Option value="SEQUENTIAL">SEQUENTIAL</Option>
                        <Option value="MIXED">MIXED</Option>
                    </Select>
                ) : (
                    value
                ),
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
                        onChange={async () => {
                            try {
                                await toggleMissionActive(record.templateId);
                                notification.success({
                                    message: '템플릿 상태 변경',
                                    description: `'${record.title}' 템플릿의 활성화 상태가 변경되었습니다.`,
                                });
                                load();
                            } catch (e) {
                                console.error(e);
                                notification.error({
                                    message: '상태 변경 실패',
                                    description: '활성화 상태를 변경할 수 없습니다.',
                                });
                            }
                        }}
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
                        onClick={() => {
                            setSelectedTemplateId(record.templateId);
                            setDrawerOpen(true);
                        }}
                    >
                        보기
                    </Button>
                ),
        },
        {
            title: '액션',
            key: 'actions',
            render: (_, record) =>
                record.isNew ? (
                    <Space>
                        <Button type="primary" size="small" onClick={handleCreate}>
                            저장
                        </Button>
                        <Button danger size="small" onClick={() => setIsCreating(false)}>
                            취소
                        </Button>
                    </Space>
                ) : null,
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>미션 템플릿 목록</h1>
                    <p style={{ marginBottom: 0, color: '#888' }}>
                        미션 템플릿을 생성하고, 설명, 타입, 활성 상태 등을 관리할 수 있습니다.
                    </p>
                </div>
                {!isCreating && (
                    <Button type="primary" onClick={() => setIsCreating(true)}>
                        ➕ 템플릿 추가
                    </Button>
                )}
            </div>

            <Table<MissionWithDraft>
                dataSource={displayData}
                columns={columns}
                rowKey="templateId"
                pagination={{ pageSize: 10 }}
            />

            <MissionInstanceDrawer
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                templateId={selectedTemplateId}
            />
        </div>
    );
};

export default MissionTemplateTab;