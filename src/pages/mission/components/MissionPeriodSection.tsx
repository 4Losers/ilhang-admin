import { Table, Input, Button, Space } from 'antd';
import { MissionPeriod } from '@/services/missionService';

interface Props {
    periods: MissionPeriod[];
    editMode: boolean;
    templateId: number | null;
    onPeriodChange: (id: number, field: keyof MissionPeriod, value: any) => void;
    onEditToggle: () => void;
    onSave: () => Promise<void>;
    onCancel: () => void;
}

const MissionPeriodSection = ({
    periods,
    editMode,
    templateId,
    onPeriodChange,
    onEditToggle,
    onSave,
    onCancel,
}: Props) => {
    return (
        <div style={{ marginTop: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>📅 미션 주기 목록</h3>
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
                ]}
            />
        </div>
    );
};

export default MissionPeriodSection; 