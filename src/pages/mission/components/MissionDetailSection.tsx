import { Button, Space } from 'antd';
import { MissionTemplateDetailResponse } from '@/services/missionService';
import { MISSION_STYLES } from '@/utils/missionUtils';
import TemplateBasicInfo from './sections/TemplateBasicInfo';
import ArrayFieldSection from './sections/ArrayFieldSection';
import CertificationSection from './sections/CertificationSection';
import ChallengeInfoSection from './sections/ChallengeInfoSection';
import RelatedMissionsSection from './sections/RelatedMissionsSection';

interface Props {
    detail: MissionTemplateDetailResponse;
    detailDraft: MissionTemplateDetailResponse | null;
    editMode: boolean;
    onDetailDraftChange: (draft: MissionTemplateDetailResponse) => void;
    categories: { categoryId: number; name: string; description: string }[];
    onFieldChange: (field: keyof MissionTemplateDetailResponse, value: any) => void;
    onEditToggle: () => void;
    onSave: () => Promise<void>;
    onCancel: () => void;
}

const MissionDetailSection = ({
    detail,
    detailDraft,
    editMode,
    onDetailDraftChange,
    categories,
    onFieldChange,
    onEditToggle,
    onSave,
    onCancel,
}: Props) => {
    const handleArrayFieldChange = (
        field: 'goodPoints' | 'howToProceed',
        index: number,
        value: string
    ) => {
        if (!detailDraft) return;

        const updated = [...(detailDraft.detail[field] || [])];
        updated[index] = value;

        onDetailDraftChange({
            ...detailDraft,
            detail: {
                ...detailDraft.detail,
                [field]: updated,
            },
        });
    };

    const handleArrayFieldAdd = (
        field: 'goodPoints' | 'howToProceed'
    ) => {
        if (!detailDraft) return;

        const updated = [...(detailDraft.detail[field] || []), ''];
        onDetailDraftChange({
            ...detailDraft,
            detail: {
                ...detailDraft.detail,
                [field]: updated,
            },
        });
    };

    const handleCertificationChange = (field: 'description' | 'deadline', value: any) => {
        if (!detailDraft) return;

        onDetailDraftChange({
            ...detailDraft,
            detail: {
                ...detailDraft.detail,
                certification: {
                    ...detailDraft.detail.certification,
                    [field]: value,
                },
            },
        });
    };

    const handleExamplesChange = (examples: any[]) => {
        if (!detailDraft) return;

        onDetailDraftChange({
            ...detailDraft,
            detail: {
                ...detailDraft.detail,
                certification: {
                    ...detailDraft.detail.certification,
                    examples: examples,
                },
            },
        });
    };

    const handleChallengeInfoChange = (field: 'availableCycles' | 'estimatedDuration', value: any) => {
        if (!detailDraft) return;

        onDetailDraftChange({
            ...detailDraft,
            detail: {
                ...detailDraft.detail,
                challengeInfo: {
                    ...detailDraft.detail.challengeInfo,
                    [field]: value,
                },
            },
        });
    };

    return (
        <div style={MISSION_STYLES.section}>
            <div style={{ ...MISSION_STYLES.sectionTitle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>📌 상세 정보</h3>
                {editMode ? (
                    <Space>
                        <Button onClick={onCancel}>❌ 취소</Button>
                        <Button type="primary" onClick={onSave}>💾 저장</Button>
                    </Space>
                ) : (
                    <Button type="primary" onClick={onEditToggle}>✏️ 수정</Button>
                )}
            </div>

            {/* 템플릿 기본 정보 */}
            <TemplateBasicInfo
                detail={detail}
                detailDraft={detailDraft}
                editMode={editMode}
                categories={categories}
                onFieldChange={onFieldChange}
            />

            {/* ✅ 이런 점이 좋아요 */}
            <ArrayFieldSection
                title="✅ 이런 점이 좋아요"
                field="goodPoints"
                detail={detail}
                detailDraft={detailDraft}
                editMode={editMode}
                onArrayFieldChange={handleArrayFieldChange}
                onArrayFieldAdd={handleArrayFieldAdd}
            />

            {/* 📖 이렇게 진행해요 */}
            <ArrayFieldSection
                title="📖 이렇게 진행해요"
                field="howToProceed"
                detail={detail}
                detailDraft={detailDraft}
                editMode={editMode}
                onArrayFieldChange={handleArrayFieldChange}
                onArrayFieldAdd={handleArrayFieldAdd}
            />

            {/* 🧾 인증 방법 */}
            <CertificationSection
                detail={detail}
                detailDraft={detailDraft}
                editMode={editMode}
                onCertificationChange={handleCertificationChange}
                onExamplesChange={handleExamplesChange}
            />

            {/* 📅 도전 정보 */}
            <ChallengeInfoSection
                detail={detail}
                detailDraft={detailDraft}
                editMode={editMode}
                onChallengeInfoChange={handleChallengeInfoChange}
            />

            {/* 🔗 관련 미션 */}
            <RelatedMissionsSection
                detail={detail}
                detailDraft={detailDraft}
                editMode={editMode}
                onDetailDraftChange={onDetailDraftChange}
            />
        </div>
    );
};

export default MissionDetailSection; 