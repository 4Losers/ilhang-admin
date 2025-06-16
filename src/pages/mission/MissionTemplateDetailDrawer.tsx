import {
    Drawer,
    Table,
    Descriptions,
    Button,
    Input,
    Select,
    Space,
    Switch,
} from 'antd';
import { useEffect, useState } from 'react';
import { MissionTemplateDetailResponse } from '@/services/missionService';

export interface MissionInstance {
    instanceId: number;
    subTitle: string;
    subDescription: string;
    orderInTemplate: number;
    nextInstanceId: number | null;
}

interface Props {
    open: boolean;
    onClose: () => void;
    templateId: number | null;
    loading: boolean;
    detail: MissionTemplateDetailResponse | null;
}

const MissionTemplateDetailDrawer = ({
    open,
    onClose,
    templateId,
    loading,
    detail,
}: Props) => {
    const [instances, setInstances] = useState<MissionInstance[]>([]);
    const [periods, setPeriods] = useState<any[]>([]);
    const [points, setPoints] = useState<any[]>([]);

    const [editMode, setEditMode] = useState(false);
    const [editPeriodMode, setEditPeriodMode] = useState(false);
    const [editPointMode, setEditPointMode] = useState(false);

    const [edited, setEdited] = useState<{
        title: string;
        description: string;
        type: string;
        categoryId: number;
        isActive: boolean;
    } | null>(null);

    useEffect(() => {
        if (detail?.instances) setInstances(detail.instances);
        if (detail?.periods) setPeriods(detail.periods);
        if (detail?.points) setPoints(detail.points);
        if (detail?.template) {
            setEdited({
                title: detail.template.title,
                description: detail.template.description,
                type: detail.template.type,
                categoryId: detail.template.categoryId,
                isActive: detail.template.isActive,
            });
        }
    }, [detail]);

    const handleChange = (field: keyof NonNullable<typeof edited>, value: any) => {
        if (!edited) return;
        setEdited((prev) => ({ ...prev!, [field]: value }));
    };

    const handleInstanceChange = (
        instanceId: number,
        field: keyof MissionInstance,
        value: any
    ) => {
        setInstances((prev) =>
            prev.map((inst) =>
                inst.instanceId === instanceId ? { ...inst, [field]: value } : inst
            )
        );
    };

    const handlePeriodChange = (periodId: number, field: string, value: any) => {
        setPeriods((prev) =>
            prev.map((p) =>
                p.periodId === periodId ? { ...p, [field]: value } : p
            )
        );
    };

    const handlePointChange = (pointId: number, field: string, value: any) => {
        setPoints((prev) =>
            prev.map((p) =>
                p.pointId === pointId ? { ...p, [field]: value } : p
            )
        );
    };

    if (!open) return null;

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
                    {/* 템플릿 수정/저장 */}
                    <div style={{ textAlign: 'right', marginBottom: 8 }}>
                        {editMode ? (
                            <Space>
                                <Button onClick={() => setEditMode(false)}>❌ 취소</Button>
                                <Button
                                    type="primary"
                                    onClick={() => {
                                        console.log('📝 저장된 템플릿:', edited);
                                        console.log('🧩 저장된 인스턴스:', instances);
                                        setEditMode(false);
                                    }}
                                >
                                    💾 저장
                                </Button>
                            </Space>
                        ) : (
                            <Button onClick={() => setEditMode(true)}>✏️ 템플릿 수정</Button>
                        )}
                    </div>

                    {/* 템플릿 정보 */}
                    {editMode && edited ? (
                        <Space direction="vertical" style={{ width: '100%', marginBottom: 24 }}>
                            <Input value={edited.title} onChange={(e) => handleChange('title', e.target.value)} placeholder="제목" />
                            <Input.TextArea rows={3} value={edited.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="설명" />
                            <Select
                                value={edited.type}
                                onChange={(value) => handleChange('type', value)}
                                style={{ width: '100%' }}
                                options={[
                                    { label: '카테고리형', value: 'CATEGORY' },
                                    { label: '연계형', value: 'SEQUENTIAL' },
                                    { label: '혼합형', value: 'MIXED' },
                                ]}
                            />
                            <Input
                                value={edited.categoryId}
                                type="number"
                                onChange={(e) => handleChange('categoryId', Number(e.target.value))}
                                placeholder="카테고리 ID"
                            />
                            <div>
                                <span style={{ marginRight: 8 }}>공개 여부</span>
                                <Switch
                                    checked={edited.isActive}
                                    onChange={(checked) => handleChange('isActive', checked)}
                                />
                            </div>
                        </Space>
                    ) : detail.template ? (
                        <Descriptions bordered size="small" column={1} style={{ marginBottom: 24 }}>
                            <Descriptions.Item label="제목">{detail.template.title}</Descriptions.Item>
                            <Descriptions.Item label="설명">{detail.template.description}</Descriptions.Item>
                            <Descriptions.Item label="타입">{detail.template.type}</Descriptions.Item>
                            <Descriptions.Item label="카테고리 ID">{detail.template.categoryId}</Descriptions.Item>
                            <Descriptions.Item label="공개 여부">{detail.template.isActive ? '공개' : '비공개'}</Descriptions.Item>
                        </Descriptions>
                    ) : (
                        <p>템플릿 정보를 찾을 수 없습니다.</p>
                    )}

                    {/* 인스턴스 목록 */}
                    <Table
                        title={() => '🧩 미션 인스턴스 목록'}
                        dataSource={instances}
                        rowKey="instanceId"
                        pagination={false}
                        columns={[
                            { title: 'ID', dataIndex: 'instanceId' },
                            {
                                title: '제목',
                                dataIndex: 'subTitle',
                                render: (text, record) =>
                                    editMode ? (
                                        <Input
                                            value={record.subTitle}
                                            onChange={(e) =>
                                                handleInstanceChange(record.instanceId, 'subTitle', e.target.value)
                                            }
                                        />
                                    ) : (
                                        text
                                    ),
                            },
                            {
                                title: '설명',
                                dataIndex: 'subDescription',
                                render: (text, record) =>
                                    editMode ? (
                                        <Input
                                            value={record.subDescription}
                                            onChange={(e) =>
                                                handleInstanceChange(record.instanceId, 'subDescription', e.target.value)
                                            }
                                        />
                                    ) : (
                                        text
                                    ),
                            },
                            {
                                title: '순서',
                                dataIndex: 'orderInTemplate',
                                render: (text, record) =>
                                    editMode ? (
                                        <Input
                                            type="number"
                                            value={record.orderInTemplate}
                                            onChange={(e) =>
                                                handleInstanceChange(record.instanceId, 'orderInTemplate', Number(e.target.value))
                                            }
                                        />
                                    ) : (
                                        text
                                    ),
                            },
                            {
                                title: '다음 ID',
                                dataIndex: 'nextInstanceId',
                                render: (text, record) =>
                                    editMode ? (
                                        <Input
                                            type="number"
                                            value={record.nextInstanceId ?? ''}
                                            onChange={(e) =>
                                                handleInstanceChange(record.instanceId, 'nextInstanceId', e.target.value ? Number(e.target.value) : null)
                                            }
                                        />
                                    ) : (
                                        text ?? '-'
                                    ),
                            },
                        ]}
                    />

                    {/* 주기 목록 */}
                    <div style={{ marginTop: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>📅 미션 주기 목록</h3>
                            {editPeriodMode ? (
                                <Space>
                                    <Button onClick={() => setEditPeriodMode(false)}>❌ 취소</Button>
                                    <Button type="primary" onClick={() => {
                                        console.log('📅 저장된 주기 목록:', periods);
                                        setEditPeriodMode(false);
                                    }}>💾 저장</Button>
                                </Space>
                            ) : (
                                <Button onClick={() => setEditPeriodMode(true)}>✏️ 수정</Button>
                            )}
                        </div>
                        <Table
                            dataSource={periods}
                            rowKey="periodId"
                            pagination={false}
                            columns={[
                                { title: 'ID', dataIndex: 'periodId' },
                                {
                                    title: '주기 ID',
                                    dataIndex: 'cycleId',
                                    render: (text, record) =>
                                        editPeriodMode ? (
                                            <Input
                                                value={record.cycleId}
                                                onChange={(e) =>
                                                    handlePeriodChange(record.periodId, 'cycleId', Number(e.target.value))
                                                }
                                            />
                                        ) : (
                                            text
                                        ),
                                },
                            ]}
                        />
                    </div>

                    {/* 도전금 목록 */}
                    <div style={{ marginTop: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3>💰 도전금 목록</h3>
                            {editPointMode ? (
                                <Space>
                                    <Button onClick={() => setEditPointMode(false)}>❌ 취소</Button>
                                    <Button type="primary" onClick={() => {
                                        console.log('💰 저장된 도전금 목록:', points);
                                        setEditPointMode(false);
                                    }}>💾 저장</Button>
                                </Space>
                            ) : (
                                <Button onClick={() => setEditPointMode(true)}>✏️ 수정</Button>
                            )}
                        </div>
                        <Table
                            dataSource={points}
                            rowKey="pointId"
                            pagination={false}
                            columns={[
                                { title: 'ID', dataIndex: 'pointId' },
                                {
                                    title: '연결된 주기 ID',
                                    dataIndex: 'periodId',
                                    render: (text, record) =>
                                        editPointMode ? (
                                            <Input
                                                value={record.periodId}
                                                onChange={(e) =>
                                                    handlePointChange(record.pointId, 'periodId', Number(e.target.value))
                                                }
                                            />
                                        ) : (
                                            text
                                        ),
                                },
                                {
                                    title: '도전금',
                                    dataIndex: 'challengePoint',
                                    render: (text, record) =>
                                        editPointMode ? (
                                            <Input
                                                value={record.challengePoint}
                                                onChange={(e) =>
                                                    handlePointChange(record.pointId, 'challengePoint', Number(e.target.value))
                                                }
                                            />
                                        ) : (
                                            text
                                        ),
                                },
                            ]}
                        />
                    </div>
                </>
            )}
        </Drawer>
    );
};

export default MissionTemplateDetailDrawer;