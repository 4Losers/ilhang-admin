import { Table, Input, Button, Space } from 'antd';
import { MissionPoint } from '@/services/missionService';

interface Props {
    points: MissionPoint[];
    editMode: boolean;
    onPointChange: (id: number, field: keyof MissionPoint, value: any) => void;
    onEditToggle: () => void;
    onSave: () => Promise<void>;
    onCancel: () => void;
    onAdd?: () => void;
    onRemove?: (pointId: number) => void;
}

const MissionPointSection = ({
    points,
    editMode,
    onPointChange,
    onEditToggle,
    onSave,
    onCancel,
    onAdd,
    onRemove,
}: Props) => {
    return (
        <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>💰 도전금 목록</h3>
                <Space>
                    {editMode && onAdd && (
                        <Button type="dashed" onClick={onAdd}>➕ 추가</Button>
                    )}
                    {editMode ? (
                        <>
                            <Button onClick={onCancel}>❌ 취소</Button>
                            <Button type="primary" onClick={onSave}>💾 저장</Button>
                        </>
                    ) : (
                        <Button type="primary" onClick={onEditToggle}>✏️ 수정</Button>
                    )}
                </Space>
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
                            editMode ? (
                                <Input
                                    value={record.periodId}
                                    onChange={(e) =>
                                        onPointChange(record.pointId, 'periodId', Number(e.target.value))
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
                            editMode ? (
                                <Input
                                    value={record.challengePoint}
                                    onChange={(e) =>
                                        onPointChange(record.pointId, 'challengePoint', Number(e.target.value))
                                    }
                                />
                            ) : (
                                text
                            ),
                    },
                    ...(editMode && onRemove ? [{
                        title: '삭제',
                        key: 'action',
                        render: (_: any, record: MissionPoint) => (
                            <Button
                                type="text"
                                danger
                                size="small"
                                onClick={() => onRemove(record.pointId)}
                            >
                                🗑️
                            </Button>
                        ),
                    }] : []),
                ]}
            />
        </div>
    );
};

export default MissionPointSection; 