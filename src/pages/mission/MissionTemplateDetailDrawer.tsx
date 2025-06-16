import {
    Drawer,
    Table,
    Button,
    Input,
    Space,
    notification
} from 'antd';
import { useEffect, useState } from 'react';
import { updateMissionPoint, updateMissionPeriod, updateMissionInstance, MissionTemplateDetailResponse } from '@/services/missionService';

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

    useEffect(() => {
        if (detail?.instances) setInstances(detail.instances);
        if (detail?.periods) setPeriods(detail.periods);
        if (detail?.points) setPoints(detail.points);
    }, [detail]);

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
                    {/* 인스턴스 목록 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <h3>🧩 미션 인스턴스 목록</h3>
                        {editMode ? (
                            <Space>
                                <Button onClick={() => setEditMode(false)}>❌ 취소</Button>
                                <Button
                                    type="primary"
                                    onClick={async () => {
                                        try {
                                            for (const instance of instances) {
                                                await updateMissionInstance(instance.instanceId, {
                                                    templateId: templateId!,
                                                    subTitle: instance.subTitle,
                                                    subDescription: instance.subDescription,
                                                    orderInTemplate: instance.orderInTemplate,
                                                    nextInstanceId: instance.nextInstanceId,
                                                });
                                            }
                                            notification.success({ message: '인스턴스가 저장되었습니다.' });
                                            setEditMode(false);
                                        } catch (e) {
                                            notification.error({ message: '인스턴스 저장 실패' });
                                        }
                                    }}
                                >
                                    💾 저장
                                </Button>
                            </Space>
                        ) : (
                            <Button onClick={() => setEditMode(true)}>✏️ 수정</Button>
                        )}
                    </div>
                    <Table
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
                                            value={record.subTitle ?? ''}
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
                                            value={record.subDescription ?? ''}
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
                                                handleInstanceChange(
                                                    record.instanceId,
                                                    'nextInstanceId',
                                                    e.target.value ? Number(e.target.value) : null
                                                )
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
                                    <Button
                                        type="primary"
                                        onClick={async () => {
                                            try {
                                                for (const period of periods) {
                                                    await updateMissionPeriod(period.periodId, {
                                                        templateId: templateId!,
                                                        cycleId: period.cycleId,
                                                    });
                                                }
                                                notification.success({ message: '주기 정보가 저장되었습니다.' });
                                                setEditPeriodMode(false);
                                            } catch (e) {
                                                notification.error({ message: '주기 저장 중 오류 발생' });
                                            }
                                        }}
                                    >
                                        💾 저장
                                    </Button>
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
                                    <Button
                                        type="primary"
                                        onClick={async () => {
                                            try {
                                                for (const point of points) {
                                                    await updateMissionPoint(point.pointId, {
                                                        periodId: point.periodId,
                                                        challengePoint: point.challengePoint,
                                                    });
                                                }
                                                notification.success({ message: '도전금 정보가 저장되었습니다.' });
                                                setEditPointMode(false);
                                            } catch (e) {
                                                notification.error({ message: '도전금 저장 실패' });
                                            }
                                        }}
                                    >
                                        💾 저장
                                    </Button>
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