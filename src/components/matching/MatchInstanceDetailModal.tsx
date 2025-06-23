import React from 'react';
import { Modal, Card, Table, Tag } from 'antd';
import { MatchInstanceDetail } from '../../services/matching/types';
import { getStatusConfig } from './utils/matchStatusUtils';
import { getGroupTableColumns } from './utils/tableColumns';

interface MatchInstanceDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    selectedInstance: MatchInstanceDetail | null;
}

const MatchInstanceDetailModal: React.FC<MatchInstanceDetailModalProps> = ({
    visible,
    onCancel,
    selectedInstance
}) => {
    if (!selectedInstance) return null;

    return (
        <Modal
            title="매치 인스턴스 상세 정보"
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={800}
        >
            <div>
                <Card title="기본 정보" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <strong>인스턴스 ID:</strong> {selectedInstance.instanceId}
                        </div>
                        <div>
                            <strong>주기명:</strong> {selectedInstance.cycleName}
                        </div>
                        <div>
                            <strong>설명:</strong> {selectedInstance.description}
                        </div>
                        <div>
                            <strong>상태:</strong>
                            <Tag color={getStatusConfig(selectedInstance.status).color} style={{ marginLeft: '8px' }}>
                                {getStatusConfig(selectedInstance.status).text}
                            </Tag>
                        </div>
                        <div>
                            <strong>기본 생명력:</strong> {selectedInstance.defaultLifePoint}
                        </div>
                        <div>
                            <strong>총 신청자:</strong> {selectedInstance.totalApplications}
                        </div>
                    </div>
                </Card>

                <Card title="시간 정보" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                            <strong>모집 시작:</strong> {new Date(selectedInstance.applicationStartTime).toLocaleString('ko-KR')}
                        </div>
                        <div>
                            <strong>모집 종료:</strong> {new Date(selectedInstance.applicationEndTime).toLocaleString('ko-KR')}
                        </div>
                        <div>
                            <strong>매칭 실행:</strong> {new Date(selectedInstance.matchingExecTime).toLocaleString('ko-KR')}
                        </div>
                        <div>
                            <strong>매치 시작:</strong> {new Date(selectedInstance.matchStartTime).toLocaleString('ko-KR')}
                        </div>
                        <div>
                            <strong>매치 종료:</strong> {new Date(selectedInstance.matchEndTime).toLocaleString('ko-KR')}
                        </div>
                    </div>
                </Card>

                <Card title="그룹 정보">
                    <Table
                        dataSource={selectedInstance.groups}
                        rowKey="matchGroupId"
                        pagination={false}
                        columns={getGroupTableColumns()}
                        size="small"
                    />
                </Card>
            </div>
        </Modal>
    );
};

export default MatchInstanceDetailModal; 