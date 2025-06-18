import { Input, Space, Select, Button } from 'antd';
import { MissionTemplateDetailResponse } from '@/services/missionService';
import { MISSION_STYLES } from '@/utils/missionUtils';

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

    const handleCertificationChange = (field: keyof typeof detail.detail.certification, value: any) => {
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

    const handleChallengeInfoChange = (field: keyof typeof detail.detail.challengeInfo, value: any) => {
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

            {/* 템플릿 기본 정보 수정 UI */}
            <div style={{ marginBottom: 16 }}>
                <div style={{ marginBottom: 8 }}>
                    <strong>제목:</strong>{' '}
                    {editMode ? (
                        <Input
                            value={detailDraft?.title ?? detail.title ?? ''}
                            onChange={e => onFieldChange('title', e.target.value)}
                            style={{ width: 300 }}
                        />
                    ) : (
                        detail.title ?? ''
                    )}
                </div>
                <div style={{ marginBottom: 8 }}>
                    <strong>설명:</strong>{' '}
                    {editMode ? (
                        <Input
                            value={detailDraft?.description ?? detail.description ?? ''}
                            onChange={e => onFieldChange('description', e.target.value)}
                            style={{ width: 400 }}
                        />
                    ) : (
                        detail.description ?? ''
                    )}
                </div>
                <div style={{ marginBottom: 8 }}>
                    <strong>카테고리:</strong>{' '}
                    {editMode ? (
                        <Select
                            value={detailDraft?.categoryId ?? detail.categoryId}
                            onChange={val => onFieldChange('categoryId', val)}
                            style={{ width: 200 }}
                        >
                            {categories.map(cat => (
                                <Select.Option key={cat.categoryId} value={cat.categoryId}>
                                    {cat.name}
                                </Select.Option>
                            ))}
                        </Select>
                    ) : (
                        categories.find(cat => cat.categoryId === (detail.categoryId ?? 0))?.name || detail.categoryId || ''
                    )}
                </div>
                <div style={{ marginBottom: 8 }}>
                    <strong>타입:</strong>{' '}
                    {editMode ? (
                        <Select
                            value={detailDraft?.type ?? detail.type}
                            onChange={val => onFieldChange('type', val)}
                            style={{ width: 160 }}
                        >
                            <Select.Option value="CATEGORY">CATEGORY</Select.Option>
                            <Select.Option value="SEQUENTIAL">SEQUENTIAL</Select.Option>
                            <Select.Option value="MIXED">MIXED</Select.Option>
                        </Select>
                    ) : (
                        detail.type ?? ''
                    )}
                </div>
            </div>

            {/* ✅ 이런 점이 좋아요 */}
            <div style={MISSION_STYLES.subsection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h4 style={MISSION_STYLES.subsectionTitle}>✅ 이런 점이 좋아요</h4>
                    {editMode && (
                        <Button size="small" onClick={() => handleArrayFieldAdd('goodPoints')}>
                            ➕ 추가
                        </Button>
                    )}
                </div>
                {editMode ? (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {detailDraft?.detail.goodPoints?.map((point, idx) => (
                            <Input
                                key={idx}
                                value={point}
                                onChange={(e) => handleArrayFieldChange('goodPoints', idx, e.target.value)}
                                style={{ width: '100%' }}
                            />
                        ))}
                    </Space>
                ) : (
                    <ul>
                        {detail.detail.goodPoints?.map((point, idx) => (
                            <li key={idx}>{point}</li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 📖 이렇게 진행해요 */}
            <div style={MISSION_STYLES.subsection}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h4 style={MISSION_STYLES.subsectionTitle}>📖 이렇게 진행해요</h4>
                    {editMode && (
                        <Button size="small" onClick={() => handleArrayFieldAdd('howToProceed')}>
                            ➕ 추가
                        </Button>
                    )}
                </div>
                {editMode ? (
                    <Space direction="vertical" style={{ width: '100%' }}>
                        {detailDraft?.detail.howToProceed?.map((step, idx) => (
                            <Input
                                key={idx}
                                value={step}
                                onChange={(e) => handleArrayFieldChange('howToProceed', idx, e.target.value)}
                                style={{ width: '100%' }}
                            />
                        ))}
                    </Space>
                ) : (
                    <ul>
                        {detail.detail.howToProceed?.map((step, idx) => (
                            <li key={idx}>{step}</li>
                        ))}
                    </ul>
                )}
            </div>

            {/* 🧾 인증 설명 */}
            <div style={MISSION_STYLES.subsection}>
                <h4 style={MISSION_STYLES.subsectionTitle}>🧾 인증 방법</h4>
                <p>
                    <strong>설명:</strong>{' '}
                    {editMode ? (
                        <Input
                            value={detailDraft?.detail.certification?.description || ''}
                            onChange={(e) => handleCertificationChange('description', e.target.value)}
                        />
                    ) : (
                        detail.detail.certification?.description
                    )}
                </p>
                <p>
                    <strong>마감 시각:</strong>{' '}
                    {editMode ? (
                        <Input
                            value={detailDraft?.detail.certification?.deadline || ''}
                            onChange={(e) => handleCertificationChange('deadline', e.target.value)}
                            placeholder="예: 23:59"
                        />
                    ) : (
                        detail.detail.certification?.deadline
                    )}
                </p>
            </div>

            {/* 도전 정보 */}
            <div style={MISSION_STYLES.subsection}>
                <h4 style={MISSION_STYLES.subsectionTitle}>📅 도전 정보</h4>
                <p>
                    <strong>가능한 주기:</strong>{' '}
                    {editMode ? (
                        <Input
                            value={detailDraft?.detail.challengeInfo?.availableCycles?.join(', ') || ''}
                            onChange={(e) => handleChallengeInfoChange('availableCycles', e.target.value.split(',').map(s => s.trim()))}
                            placeholder="예: 일, 월, 화"
                        />
                    ) : (
                        detail.detail.challengeInfo?.availableCycles?.join(', ')
                    )}
                </p>
                <p>
                    <strong>예상 소요 시간:</strong>{' '}
                    {editMode ? (
                        <Input
                            value={detailDraft?.detail.challengeInfo?.estimatedDuration || ''}
                            onChange={(e) => handleChallengeInfoChange('estimatedDuration', e.target.value)}
                            placeholder="예: 30분"
                        />
                    ) : (
                        detail.detail.challengeInfo?.estimatedDuration
                    )}
                </p>
            </div>

            {/* 관련 미션 */}
            <div style={MISSION_STYLES.subsection}>
                <h4 style={MISSION_STYLES.subsectionTitle}>🔗 관련 미션</h4>
                <p>
                    {editMode ? (
                        <Input
                            value={detailDraft?.detail.relatedMissionIds?.join(', ') || ''}
                            onChange={(e) => onDetailDraftChange({
                                ...detailDraft!,
                                detail: {
                                    ...detailDraft!.detail,
                                    relatedMissionIds: e.target.value.split(',').map(s => parseInt(s.trim()) || 0).filter(id => id > 0)
                                }
                            })}
                            placeholder="예: 1, 2, 3"
                        />
                    ) : (
                        detail.detail.relatedMissionIds?.join(', ') || '없음'
                    )}
                </p>
            </div>
        </div>
    );
};

export default MissionDetailSection; 