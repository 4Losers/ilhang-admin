import { useEffect, useMemo, useState, useCallback } from 'react';
import { Table, Button, notification } from 'antd';
import {
    fetchMissions,
    createMissionTemplate,
    updateMissionTemplate,
    toggleMissionActive,
    MissionTemplateView,
} from '@/services/missionService';
import { MissionCategoryResponse } from '@/services/categoryService';
import MissionInstanceDrawer from './MissionInstanceDrawer';
import { getMissionTemplateColumns } from './components/MissionTemplateColumns';
import { fetchMissionTemplateDetail, MissionTemplateDetailResponse } from '@/services/missionService';

type MissionWithDraft = MissionTemplateView & { isNew?: boolean };

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

    const [missions, setMissions] = useState<MissionTemplateView[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newMission, setNewMission] = useState<NewMissionInput>({
        title: '',
        description: '',
        type: 'CATEGORY',
        categoryId: 1,
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editMission, setEditMission] = useState<NewMissionInput | null>(null);

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

    const [templateDetail, setTemplateDetail] = useState<MissionTemplateDetailResponse | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const load = useCallback(async () => {
        try {
            const response = await fetchMissions();
            const data = Array.isArray(response)
                ? response
                : Array.isArray((response as any)?.result)
                    ? (response as any).result
                    : [];

            console.log('👉 최종 적용할 missions:', data);
            setMissions(data);
        } catch (e) {
            console.error('미션 불러오기 실패:', e);
            notification.error({
                message: '미션 불러오기 실패',
                description: '서버에서 미션 템플릿 목록을 가져오는 데 실패했습니다.',
            });
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

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

    const displayData: MissionWithDraft[] = useMemo(() => {
        const base = Array.isArray(missions) ? missions : [];
        return isCreating
            ? [{ templateId: -1, isNew: true, ...newMission } as MissionWithDraft, ...base]
            : base;
    }, [isCreating, missions, newMission]);

    const columns = useMemo(() => getMissionTemplateColumns({
        categories,
        newMission,
        validationError,
        editMission,
        editingId,
        onChangeNew: (field, value) => setNewMission(prev => ({ ...prev, [field]: value })),
        onChangeEdit: (field, value) => setEditMission(prev => ({ ...prev!, [field]: value })),
        onCreate: handleCreate,
        onCancelCreate: () => setIsCreating(false),
        onSaveEdit: async (id) => {
            try {
                await updateMissionTemplate(id, editMission!);
                notification.success({
                    message: '수정 완료',
                    description: `'${editMission?.title}' 템플릿이 수정되었습니다.`,
                });
                setEditingId(null);
                setEditMission(null);
                load();
            } catch (e) {
                console.error(e);
                notification.error({
                    message: '수정 실패',
                    description: '서버 오류로 인해 수정할 수 없습니다.',
                });
            }
        },
        onCancelEdit: () => {
            setEditingId(null);
            setEditMission(null);
        },
        onClickEdit: (id, mission) => {
            if (!mission) return;
            setEditingId(id);
            setEditMission(mission);
        },
        onToggleActive: async (id, title) => {
            try {
                await toggleMissionActive(id);
                notification.success({
                    message: '템플릿 상태 변경',
                    description: `'${title}' 템플릿의 활성화 상태가 변경되었습니다.`,
                });
                load();
            } catch (e) {
                console.error(e);
                notification.error({
                    message: '상태 변경 실패',
                    description: '활성화 상태를 변경할 수 없습니다.',
                });
            }
        },
        onOpenDrawer: async (id) => {
            try {
                setLoadingDetail(true);
                setSelectedTemplateId(id);
                setDrawerOpen(true);

                const detail = await fetchMissionTemplateDetail(id);
                setTemplateDetail(detail);
            } catch (e) {
                console.error(e);
                notification.error({
                    message: '상세 정보 조회 실패',
                    description: '템플릿 상세 정보를 불러오는 데 실패했습니다.',
                });
            } finally {
                setLoadingDetail(false);
            }
        },
    }), [categories, newMission, validationError, editMission, editingId]);

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
                loading={loadingDetail}
                detail={templateDetail}
            />
        </div>
    );
};

export default MissionTemplateTab;