import React from 'react';
import { Card, Button, Table } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { useMatchStatus } from './hooks/useMatchStatus';
import { getMatchStatusTableColumns } from './utils/tableColumns';
import MatchInstanceDetailModal from './MatchInstanceDetailModal';

interface MatchStatusPanelProps {
    className?: string;
}

const MatchStatusPanel: React.FC<MatchStatusPanelProps> = ({ className }) => {
    const {
        loading,
        instancesData,
        selectedInstance,
        instanceMissions,
        instanceGroupCounts,
        currentPage,
        pageSize,
        detailModalVisible,
        handleRefresh,
        handleTableChange,
        handleViewDetail,
        handleCloseModal,
    } = useMatchStatus();

    return (
        <div className={className}>
            {/* 헤더 */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        매치 현황
                    </h2>
                    <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                        현재 진행 중인 매치 인스턴스들의 현황을 확인할 수 있습니다
                    </p>
                </div>
                <Button
                    type="primary"
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    loading={loading}
                >
                    새로고침
                </Button>
            </div>

            {/* 매치 인스턴스 테이블 */}
            <Card title="매치 인스턴스 목록" style={{ marginBottom: '24px' }}>
                <Table
                    columns={getMatchStatusTableColumns(instanceMissions, instanceGroupCounts, handleViewDetail)}
                    dataSource={instancesData?.list || []}
                    rowKey="instanceId"
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: instancesData?.total || 0,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} / 총 ${total}개`,
                    }}
                    onChange={handleTableChange}
                    loading={loading}
                    scroll={{ x: 800 }}
                    locale={{
                        emptyText: loading ? '데이터를 불러오는 중...' : '매치 인스턴스가 없습니다.'
                    }}
                />
            </Card>

            {/* 인스턴스 상세 모달 */}
            <MatchInstanceDetailModal
                visible={detailModalVisible}
                onCancel={handleCloseModal}
                selectedInstance={selectedInstance}
            />
        </div>
    );
};

export default MatchStatusPanel; 