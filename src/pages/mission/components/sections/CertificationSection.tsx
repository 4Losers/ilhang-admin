import React from 'react';
import { Button, Space, Image, Input, Switch, Card, Row, Col, Modal, message, Upload } from 'antd';
import { PlusOutlined, DeleteOutlined, EyeOutlined, UploadOutlined } from '@ant-design/icons';
import { MissionTemplateDetailResponse } from '@/services/missionService';
import EditableField from './EditableField';

interface CertificationExample {
    imageUrl: string;
    caption: string;
    success: boolean;
}

interface CertificationSectionProps {
    detail: MissionTemplateDetailResponse;
    detailDraft: MissionTemplateDetailResponse | null;
    editMode: boolean;
    onCertificationChange: (field: 'description' | 'deadline', value: any) => void;
    onExamplesChange?: (examples: CertificationExample[]) => void;
}

const CertificationSection: React.FC<CertificationSectionProps> = ({
    detail,
    detailDraft,
    editMode,
    onCertificationChange,
    onExamplesChange
}) => {
    const [previewImage, setPreviewImage] = React.useState<string | null>(null);
    const [uploadingIndex, setUploadingIndex] = React.useState<number | null>(null);

    const getCurrentCertificationValue = (field: 'description' | 'deadline') => {
        return detailDraft?.detail.certification?.[field] ?? detail.detail.certification?.[field] ?? '';
    };

    const getCurrentExamples = (): CertificationExample[] => {
        return detailDraft?.detail.certification?.examples ?? detail.detail.certification?.examples ?? [];
    };

    const handleExampleChange = (index: number, field: keyof CertificationExample, value: any) => {
        if (!onExamplesChange) return;

        const examples = [...getCurrentExamples()];
        examples[index] = { ...examples[index], [field]: value };
        onExamplesChange(examples);
    };

    const handleAddExample = () => {
        if (!onExamplesChange) return;

        const newExample: CertificationExample = {
            imageUrl: '',
            caption: '',
            success: true,
        };

        const examples = [...getCurrentExamples(), newExample];
        onExamplesChange(examples);
    };

    const handleRemoveExample = (index: number) => {
        if (!onExamplesChange) return;

        const examples = getCurrentExamples().filter((_, i) => i !== index);
        onExamplesChange(examples);
    };

    const handleImageUpload = async (index: number, file: File) => {
        try {
            setUploadingIndex(index);

            // 서버에 이미지 업로드
            const { uploadImage } = await import('@/services/missionService');
            const result = await uploadImage(file);

            // 업로드된 이미지 URL로 업데이트
            handleExampleChange(index, 'imageUrl', result.imageUrl);
            message.success('이미지가 업로드되었습니다.');
        } catch (error) {
            console.error('이미지 업로드 실패:', error);
            message.error('이미지 업로드에 실패했습니다.');
        } finally {
            setUploadingIndex(null);
        }

        return false; // 기본 업로드 동작 방지
    };

    const examples = getCurrentExamples();

    return (
        <div style={{ marginBottom: 16, padding: 16, border: '1px solid #f0f0f0', borderRadius: 8 }}>
            <h4 style={{ margin: '0 0 12px 0' }}>🧾 인증 방법</h4>

            <EditableField
                label="설명"
                value={getCurrentCertificationValue('description')}
                editMode={editMode}
                onChange={(value) => onCertificationChange('description', value)}
                type="textarea"
                placeholder="인증 방법에 대한 설명을 입력하세요"
            />

            <EditableField
                label="마감 시각"
                value={getCurrentCertificationValue('deadline')}
                editMode={editMode}
                onChange={(value) => onCertificationChange('deadline', value)}
                type="text"
                placeholder="예: 23:59"
                style={{ width: 200 }}
            />

            {/* 인증 예시 이미지 섹션 */}
            <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <h5 style={{ margin: 0 }}>📸 인증 예시</h5>
                    {editMode && onExamplesChange && (
                        <Button
                            type="dashed"
                            icon={<PlusOutlined />}
                            onClick={handleAddExample}
                            size="small"
                        >
                            예시 추가
                        </Button>
                    )}
                </div>

                {examples.length === 0 ? (
                    <div style={{
                        padding: 24,
                        textAlign: 'center',
                        color: '#999',
                        border: '1px dashed #d9d9d9',
                        borderRadius: 6
                    }}>
                        인증 예시가 없습니다
                    </div>
                ) : (
                    <Row gutter={[16, 16]}>
                        {examples.map((example, index) => (
                            <Col xs={24} sm={12} md={8} key={index}>
                                <Card
                                    size="small"
                                    style={{ height: '100%' }}
                                    actions={editMode && onExamplesChange ? [
                                        <EyeOutlined
                                            key="preview"
                                            onClick={() => setPreviewImage(example.imageUrl)}
                                            style={{ color: '#1890ff' }}
                                        />,
                                        <DeleteOutlined
                                            key="delete"
                                            onClick={() => handleRemoveExample(index)}
                                            style={{ color: '#ff4d4f' }}
                                        />
                                    ] : [
                                        <EyeOutlined
                                            key="preview"
                                            onClick={() => setPreviewImage(example.imageUrl)}
                                            style={{ color: '#1890ff' }}
                                        />
                                    ]}
                                >
                                    <div style={{ marginBottom: 8 }}>
                                        {example.imageUrl ? (
                                            <Image
                                                src={example.imageUrl}
                                                alt={`예시 ${index + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: 120,
                                                    objectFit: 'cover',
                                                    borderRadius: 4
                                                }}
                                                preview={false}
                                            />
                                        ) : (
                                            <div style={{
                                                width: '100%',
                                                height: 120,
                                                backgroundColor: '#f5f5f5',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: 4,
                                                color: '#999'
                                            }}>
                                                이미지 없음
                                            </div>
                                        )}
                                    </div>

                                    {editMode && onExamplesChange ? (
                                        <div style={{ marginBottom: 8 }}>
                                            <Upload
                                                beforeUpload={(file) => handleImageUpload(index, file)}
                                                showUploadList={false}
                                                accept="image/*"
                                            >
                                                <Button
                                                    icon={<UploadOutlined />}
                                                    size="small"
                                                    style={{ width: '100%', marginBottom: 4 }}
                                                    loading={uploadingIndex === index}
                                                >
                                                    {uploadingIndex === index ? '업로드 중...' : '이미지 업로드'}
                                                </Button>
                                            </Upload>
                                            <Input
                                                placeholder="설명"
                                                value={example.caption}
                                                onChange={(e) => handleExampleChange(index, 'caption', e.target.value)}
                                                size="small"
                                                style={{ marginBottom: 4 }}
                                            />
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <span style={{ fontSize: 12 }}>성공 예시:</span>
                                                <Switch
                                                    size="small"
                                                    checked={example.success}
                                                    onChange={(checked) => handleExampleChange(index, 'success', checked)}
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div>
                                            <p style={{
                                                margin: '4px 0',
                                                fontSize: 12,
                                                color: '#666',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}>
                                                {example.caption || '설명 없음'}
                                            </p>
                                            <span style={{
                                                fontSize: 11,
                                                color: example.success ? '#52c41a' : '#ff4d4f',
                                                fontWeight: 'bold'
                                            }}>
                                                {example.success ? '✅ 성공 예시' : '❌ 실패 예시'}
                                            </span>
                                        </div>
                                    )}
                                </Card>
                            </Col>
                        ))}
                    </Row>
                )}
            </div>

            {/* 이미지 프리뷰 모달 */}
            <Modal
                open={!!previewImage}
                footer={null}
                onCancel={() => setPreviewImage(null)}
                width={600}
            >
                {previewImage && (
                    <Image
                        src={previewImage}
                        width="100%"
                        style={{ borderRadius: 4 }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default CertificationSection; 