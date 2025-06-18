import { Table, Input, Button, Space } from 'antd';
import { MissionInstance } from '@/services/missionService';

interface Props {
    instances: MissionInstance[];
    editMode: boolean;
    templateId: number | null;
    onInstanceChange: (id: number, field: keyof MissionInstance, value: any) => void;
    onEditToggle: () => void;
    onSave: () => Promise<void>;
    onCancel: () => void;
}

const MissionInstanceSection = ({
    instances,
    editMode,
    templateId,
    onInstanceChange,
    onEditToggle,
    onSave,
    onCancel,
}: Props) => {
    return (
        <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>🧩 미션 인스턴스 목록</h3>
                {editMode ? (
                    <Space>
                        <Button onClick={onCancel}>❌ 취소</Button>
                        <Button type="primary" onClick={onSave}>💾 저장</Button>
                    </Space>
                ) : (
                    <Button type="primary" onClick={onEditToggle}>✏️ 수정</Button>
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
                                        onInstanceChange(record.instanceId, 'subTitle', e.target.value)
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
                                        onInstanceChange(record.instanceId, 'subDescription', e.target.value)
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
                                        onInstanceChange(record.instanceId, 'orderInTemplate', Number(e.target.value))
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
                                        onInstanceChange(
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
        </div>
    );
};

export default MissionInstanceSection; 