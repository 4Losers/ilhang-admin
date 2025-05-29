import { Drawer, Table, Input, Button, Space, message, Descriptions } from 'antd';
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

const MissionInstanceDrawer = ({ open, onClose, templateId, loading, detail }: Props) => {
    const [instances, setInstances] = useState<MissionInstance[]>([]);
    const [newInstance, setNewInstance] = useState<Partial<MissionInstance>>({
        subTitle: '',
        subDescription: '',
        orderInTemplate: 1,
        nextInstanceId: undefined,
    });

    // ✅ detail 바뀌면 인스턴스 목록 반영
    useEffect(() => {
        if (detail?.instances) {
            setInstances(detail.instances);
        }
    }, [detail]);

    // ✅ 인스턴스 추가만 직접 POST
    const handleCreate = async () => {
        if (!templateId || !newInstance.subTitle || !newInstance.orderInTemplate) {
            message.warning('필수 항목을 모두 입력해주세요.');
            return;
        }
        try {
            await fetch('/admin/missions/instances', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    templateId,
                    ...newInstance,
                }),
            });
            message.success('인스턴스 추가 완료');
            // detail 갱신은 부모 컴포넌트에서 다시 fetch 하도록 구성 예정
            setNewInstance({
                subTitle: '',
                subDescription: '',
                orderInTemplate: 1,
                nextInstanceId: undefined,
            });
        } catch (e) {
            console.error(e);
            message.error('인스턴스 추가 실패');
        }
    };

    return (
        <Drawer
            title={
                loading
                    ? '인스턴스 정보를 불러오는 중...'
                    : `템플릿 #${templateId} - 인스턴스 목록`
            }
            placement="right"
            width={600}
            onClose={onClose}
            open={open}
        >
            {loading ? (
                <p>불러오는 중...</p>
            ) : (
                <>
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
                            onChange={(e) =>
                                setNewInstance({ ...newInstance, subTitle: e.target.value })
                            }
                        />
                        <Input
                            placeholder="설명"
                            value={newInstance.subDescription}
                            onChange={(e) =>
                                setNewInstance({ ...newInstance, subDescription: e.target.value })
                            }
                        />
                        <Input
                            placeholder="순서"
                            type="number"
                            value={newInstance.orderInTemplate}
                            onChange={(e) =>
                                setNewInstance({
                                    ...newInstance,
                                    orderInTemplate: Number(e.target.value),
                                })
                            }
                        />
                        <Input
                            placeholder="다음 인스턴스 ID (선택)"
                            value={newInstance.nextInstanceId !== null && newInstance.nextInstanceId !== undefined
                                ? String(newInstance.nextInstanceId)
                                : ''}
                            onChange={(e) =>
                                setNewInstance({
                                    ...newInstance,
                                    nextInstanceId: e.target.value
                                        ? Number(e.target.value)
                                        : null, // ← null 사용
                                })
                            }
                        />
                        <Button type="primary" onClick={handleCreate}>
                            저장
                        </Button>
                    </Space>
                </>
            )}
        </Drawer>
    );
};

export default MissionInstanceDrawer;