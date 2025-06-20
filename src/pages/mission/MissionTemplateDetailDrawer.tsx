import { Drawer } from 'antd';
import { useEditModes } from '@/hooks/useEditModes';
import { useMissionTemplateDetail } from '@/hooks/useMissionTemplateDetail';
import { useMissionSave } from '@/hooks/useMissionSave';
import { MissionTemplateDetailDrawerProps } from '@/types/missionTemplate';
import MissionDetailSection from './components/MissionDetailSection';
import MissionInstanceSection from './components/MissionInstanceSection';
import MissionPeriodSection from './components/MissionPeriodSection';
import MissionPointSection from './components/MissionPointSection';

const MissionTemplateDetailDrawer = ({
    open,
    onClose,
    templateId,
    loading,
    detail,
    categories,
    onSave,
}: MissionTemplateDetailDrawerProps) => {
    // Custom Hooks 사용
    const {
        editModes,
        toggleEditMode,
        cancelEditMode,
        setEditModes,
    } = useEditModes();

    const {
        detailDraft,
        setDetailDraft,
        handleInstanceChange,
        handlePeriodChange,
        handlePointChange,
        handleDetailDraftFieldChange,
        resetDetailDraft,
        addInstance,
        addPeriod,
        addPoint,
        removeInstance,
        removePeriod,
        removePoint,
    } = useMissionTemplateDetail({ detail });

    const {
        handleDetailSave,
        handleInstancesSave,
        handlePeriodsSave,
        handlePointsSave,
    } = useMissionSave({
        templateId,
        detailDraft,
        onSave,
        setDetailDraft,
        setEditModes,
    });

    // 편집 모드 취소 시 detailDraft도 복원
    const handleCancelEditMode = (section: keyof typeof editModes) => {
        cancelEditMode(section);
        resetDetailDraft();
    };

    if (!open || !detail) return null;

    return (
        <Drawer
            title="미션 상세 보기"
            placement="right"
            width={600}
            onClose={onClose}
            open={open}
        >
            {loading || !detail ? (
                <p>불러오는 중...</p>
            ) : (
                <>
                    <MissionDetailSection
                        detail={detail}
                        detailDraft={detailDraft}
                        editMode={editModes.detail}
                        onDetailDraftChange={setDetailDraft}
                        categories={categories}
                        onFieldChange={handleDetailDraftFieldChange}
                        onEditToggle={() => toggleEditMode('detail')}
                        onSave={handleDetailSave}
                        onCancel={() => handleCancelEditMode('detail')}
                    />

                    <MissionInstanceSection
                        instances={detailDraft?.instances || []}
                        editMode={editModes.instances}
                        templateId={templateId}
                        onInstanceChange={handleInstanceChange}
                        onEditToggle={() => toggleEditMode('instances')}
                        onSave={handleInstancesSave}
                        onCancel={() => handleCancelEditMode('instances')}
                        onAdd={addInstance}
                        onRemove={removeInstance}
                    />

                    <MissionPeriodSection
                        periods={detailDraft?.periods || []}
                        editMode={editModes.periods}
                        templateId={templateId}
                        onPeriodChange={handlePeriodChange}
                        onEditToggle={() => toggleEditMode('periods')}
                        onSave={handlePeriodsSave}
                        onCancel={() => handleCancelEditMode('periods')}
                        onAdd={addPeriod}
                        onRemove={removePeriod}
                    />

                    <MissionPointSection
                        points={detailDraft?.points || []}
                        editMode={editModes.points}
                        onPointChange={handlePointChange}
                        onEditToggle={() => toggleEditMode('points')}
                        onSave={handlePointsSave}
                        onCancel={() => handleCancelEditMode('points')}
                        onAdd={addPoint}
                        onRemove={removePoint}
                    />
                </>
            )}
        </Drawer>
    );
};

export default MissionTemplateDetailDrawer; 