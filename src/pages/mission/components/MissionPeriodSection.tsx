import { Table, Input, Button, Space } from 'antd';
import { MissionPeriod } from '@/services/missionService';

interface MissionPeriodSectionProps {
    periods: MissionPeriod[];
    editMode: boolean;
    onPeriodChange: (id: number, field: keyof MissionPeriod, value: any) => void;
    onEditToggle: () => void;
    onSave: () => Promise<void>;
    onCancel: () => void;
    onAdd?: () => void;
    onRemove?: (periodId: number) => void;
}

const MissionPeriodSection = ({
    periods,
    editMode,
    onPeriodChange,
    onEditToggle,
    onSave,
    onCancel,
    onAdd,
    onRemove,
}: MissionPeriodSectionProps) => {
    return (
        <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>📅 미션 주기 목록</h3>
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
                dataSource={periods}
                rowKey="periodId"
                pagination={false}
                columns={[
                    { title: 'ID', dataIndex: 'periodId' },
                    {
                        title: '주기 ID',
                        dataIndex: 'cycleId',
                        render: (text, record) =>
                            editMode ? (
                                <Input
                                    value={record.cycleId}
                                    onChange={(e) =>
                                        onPeriodChange(record.periodId, 'cycleId', Number(e.target.value))
                                    }
                                />
                            ) : (
                                text
                            ),
                    },
                    ...(editMode && onRemove ? [{
                        title: '삭제',
                        key: 'action',
                        render: (_: any, record: MissionPeriod) => (
                            <Button
                                type="text"
                                danger
                                size="small"
                                onClick={() => onRemove(record.periodId)}
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

export default MissionPeriodSection; 