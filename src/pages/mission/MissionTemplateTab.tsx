import { useEffect, useMemo, useState, useCallback } from 'react';
import { Table, Button, message } from 'antd';
import {
    fetchMissions,
    createMissionTemplate,
    toggleMissionActive,
    fetchMissionTemplateDetail,
    MissionTemplateView,
    MissionTemplateDetailResponse
} from '@/services/missionService';
import { MissionCategoryResponse } from '@/services/categoryService';
import { validateMissionTemplate, hasValidationErrors } from '@/utils/missionUtils';
import MissionTemplateDetailDrawer from './MissionTemplateDetailDrawer';
import { getMissionTemplateColumns } from './components/MissionTemplateColumns';

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

    // 드로워 관련 상태
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
    const [templateDetail, setTemplateDetail] = useState<MissionTemplateDetailResponse | null>(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const load = useCallback(async () => {
        try {
            const data = await fetchMissions();
            setMissions(data);
        } catch (e) {
            console.error('미션 불러오기 실패:', e);
            message.error('미션 템플릿 목록을 가져오는 데 실패했습니다.');
        }
    }, []);

    useEffect(() => {
        load();
    }, [load]);

    const handleCreate = async () => {
        const errors = validateMissionTemplate(newMission);
        setValidationError(errors);

        if (hasValidationErrors(errors)) {
            message.warning('모든 항목을 입력해주세요.');
            return;
        }

        try {
            await createMissionTemplate(newMission);
            message.success(`'${newMission.title}' 템플릿이 성공적으로 추가되었습니다.`);
            setIsCreating(false);
            setNewMission({ title: '', description: '', type: 'CATEGORY', categoryId: 1 });
            setValidationError({ title: false, description: false, categoryId: false, type: false });
            load();
        } catch (e) {
            console.error(e);
            message.error('템플릿 생성 중 문제가 발생했습니다.');
        }
    };

    const handleTitleClick = async (templateId: number) => {
        try {
            setLoadingDetail(true);
            setSelectedTemplateId(templateId);
            setDrawerOpen(true);

            const detail = await fetchMissionTemplateDetail(templateId);
            const matchedFromView = missions.find(m => m.templateId === templateId);
            if (matchedFromView) {
                setTemplateDetail({
                    ...matchedFromView,  // 기본 정보 (title, description, categoryId, type 등)
                    ...detail,           // 상세 정보 (periods, points, instances)
                });
            } else {
                message.error('미션 정보를 찾을 수 없습니다.');
                setDrawerOpen(false);
            }
        } catch (e) {
            console.error(e);
            message.error('템플릿 상세 정보를 불러오는 데 실패했습니다.');
        } finally {
            setLoadingDetail(false);
        }
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
        setSelectedTemplateId(null);
        setTemplateDetail(null);
        // 드로워가 닫힐 때 목록 새로고침
        load();
    };

    const handleToggleActive = async (id: number, title: string) => {
        try {
            await toggleMissionActive(id);
            message.success(`'${title}' 템플릿의 활성화 상태가 변경되었습니다.`);
            load();
        } catch (e) {
            console.error(e);
            message.error('활성화 상태를 변경할 수 없습니다.');
        }
    };

    const handleDrawerSave = async () => {
        try {
            const updatedMissions = await fetchMissions();  // missions 목록 새로고침
            setMissions(updatedMissions);
            if (selectedTemplateId) {
                // detail 정보도 새로고침
                const detail = await fetchMissionTemplateDetail(selectedTemplateId);
                const matchedFromView = updatedMissions.find(m => m.templateId === selectedTemplateId);
                if (matchedFromView) {
                    const updatedDetail = {
                        ...matchedFromView,
                        ...detail,
                    };
                    setTemplateDetail(updatedDetail);
                    return updatedDetail;  // 새로운 detail 정보 반환
                }
            }
            throw new Error('템플릿을 찾을 수 없습니다.');
        } catch (e) {
            console.error('새로고침 실패:', e);
            message.error('정보를 새로고침하는데 실패했습니다.');
            throw e;  // 에러를 상위로 전파
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
        onChangeNew: (field, value) => setNewMission(prev => ({ ...prev, [field]: value })),
        onCreate: handleCreate,
        onCancelCreate: () => setIsCreating(false),
        onTitleClick: handleTitleClick,
        onToggleActive: handleToggleActive,
    }), [categories, newMission, validationError, missions]);

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

            <MissionTemplateDetailDrawer
                open={drawerOpen}
                onClose={handleDrawerClose}
                templateId={selectedTemplateId}
                loading={loadingDetail}
                detail={templateDetail}
                categories={categories}
                onSave={handleDrawerSave}
            />
        </div>
    );
};

export default MissionTemplateTab;