import React from 'react';
import {
    Card,
    Table,
    Button,
    Space
} from 'antd';
import {
    ReloadOutlined,
    SearchOutlined
} from '@ant-design/icons';
import { useMatchingLogs } from './hooks/useMatchingLogs';
import { getLogTableColumns } from './utils/logTableColumns';
import LogFilterForm from './components/LogFilterForm';
import LogDetailModal from './components/LogDetailModal';

interface MatchingLogPanelProps {
    className?: string;
}

const MatchingLogPanel: React.FC<MatchingLogPanelProps> = ({ className }) => {
    const {
        loading,
        logs,
        total,
        currentPage,
        pageSize,
        filter,
        filterVisible,
        detailModalVisible,
        selectedLog,
        handleRefresh,
        handlePageChange,
        handleFilterSubmit,
        handleFilterReset,
        handleViewDetail,
        handleCloseDetailModal,
        toggleFilterVisible,
    } = useMatchingLogs();

    return (
        <div className={`matching-log-panel ${className || ''}`}>
            <Card
                title="매칭 로그"
                extra={
                    <Space>
                        <Button
                            icon={<SearchOutlined />}
                            onClick={toggleFilterVisible}
                        >
                            필터
                        </Button>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleRefresh}
                            loading={loading}
                        >
                            새로고침
                        </Button>
                    </Space>
                }
            >
                {/* 필터 영역 */}
                {filterVisible && (
                    <LogFilterForm
                        filter={filter}
                        onSubmit={handleFilterSubmit}
                        onReset={handleFilterReset}
                    />
                )}

                {/* 테이블 */}
                <Table
                    columns={getLogTableColumns(handleViewDetail)}
                    dataSource={logs}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} / 총 ${total}개`,
                        onChange: handlePageChange,
                        onShowSizeChange: handlePageChange
                    }}
                />
            </Card>

            {/* 상세 모달 */}
            <LogDetailModal
                visible={detailModalVisible}
                onCancel={handleCloseDetailModal}
                selectedLog={selectedLog}
            />
        </div>
    );
};

export default MatchingLogPanel; 