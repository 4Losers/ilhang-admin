// src/pages/mission/MissionInstanceDrawer.tsx
import { Drawer, Table, Input, Button, Space, message } from 'antd';
import { useEffect, useState } from 'react';
import axiosClient from '@/services/axiosClient';

export interface MissionInstance {
    instanceId: number;
    subTitle: string;
    subDescription: string;
    orderInTemplate: number;
    nextInstanceId?: number;
}

interface Props {
    open: boolean;
    onClose: () => void;
    templateId: number | null;
}

const MissionInstanceDrawer = ({ open, onClose, templateId }: Props) => {
    const [instances, setInstances] = useState<MissionInstance[]>([]);
    const [newInstance, setNewInstance] = useState<Partial<MissionInstance>>({
        subTitle: '',
        subDescription: '',
        orderInTemplate: 1,
        nextInstanceId: undefined,
    });

    const loadInstances = async () => {
        if (!templateId) return;
        try {
            const res = await axiosClient.get<MissionInstance[]>(
                `/admin/missions/instances?templateId=${templateId}`
            );
            setInstances(res.data);
        } catch (e) {
            console.error(e);
            message.error('인스턴스 목록 불러오기 실패');
        }
    };

    const handleCreate = async () => {
        if (!templateId || !newInstance.subTitle || !newInstance.orderInTemplate) {
            message.warning('필수 항목을 모두 입력해주세요.');
            return;
        }
        try {
            await axiosClient.post('/admin/missions/instances', {
                templateId,
                ...newInstance,
            });
            message.success('인스턴스 추가 완료');
            setNewInstance({
                subTitle: '',
                subDescription: '',
                orderInTemplate: 1,
                nextInstanceId: undefined,
            });
            loadInstances();
        } catch (e) {
            console.error(e);
            message.error('인스턴스 추가 실패');
        }
    };

    useEffect(() => {
        if (open) loadInstances();
    }, [open, templateId]);

    return (
        <Drawer
            title={`템플릿 #${templateId} - 인스턴스 목록`}
            placement="right"
            width={600}
            onClose={onClose}
            open={open}
        >
            <Table
                dataSource={instances}
                rowKey="instanceId"
                pagination={false}
                columns={[
                    { title: 'ID', dataIndex: 'instanceId' },
                    { title: '제목', dataIndex: 'subTitle' },
                    { title: '설명', dataIndex: 'subDescription' },
                    { title: '순서', dataIndex: 'orderInTemplate' },
                    { title: '다음 ID', dataIndex: 'nextInstanceId' },
                ]}
            />

            <h4 style={{ marginTop: 24 }}>➕ 새 인스턴스 추가</h4>
            <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                    placeholder="인스턴스 제목"
                    value={newInstance.subTitle}
                    onChange={(e) => setNewInstance({ ...newInstance, subTitle: e.target.value })}
                />
                <Input
                    placeholder="설명"
                    value={newInstance.subDescription}
                    onChange={(e) => setNewInstance({ ...newInstance, subDescription: e.target.value })}
                />
                <Input
                    placeholder="순서"
                    type="number"
                    value={newInstance.orderInTemplate}
                    onChange={(e) =>
                        setNewInstance({ ...newInstance, orderInTemplate: Number(e.target.value) })
                    }
                />
                <Input
                    placeholder="다음 인스턴스 ID (선택)"
                    value={newInstance.nextInstanceId}
                    onChange={(e) =>
                        setNewInstance({
                            ...newInstance,
                            nextInstanceId: e.target.value ? Number(e.target.value) : undefined,
                        })
                    }
                />
                <Button type="primary" onClick={handleCreate}>
                    저장
                </Button>
            </Space>
        </Drawer>
    );
};

export default MissionInstanceDrawer;
