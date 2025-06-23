import React from 'react';
import { Card, Table, Button, Input, Space } from 'antd';
import { PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import { useCycleManagement } from './hooks/useCycleManagement';
import { getCycleTableColumns } from './utils/cycleTableColumns';
import CycleFormModal from './CycleFormModal';

interface CycleManagementPanelProps {
    className?: string;
}

const CycleManagementPanel: React.FC<CycleManagementPanelProps> = ({ className }) => {
    const {
        loading,
        cyclesData,
        currentPage,
        pageSize,
        cycleModalVisible,
        editingCycle,
        handleCreateCycle,
        handleEditCycle,
        handleCycleSubmit,
        handleToggleCycleStatus,
        handleTableChange,
        handleSearch,
        handleRefresh,
        handleCloseModal,
    } = useCycleManagement();

    return (
        <div className={className}>
            {/* 헤더 */}
            <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold' }}>
                        매치 주기 관리
                    </h2>
                    <p style={{ margin: '4px 0 0 0', color: '#666' }}>
                        매치 주기를 생성하고 관리할 수 있습니다
                    </p>
                </div>
                <Space>
                    <Input.Search
                        placeholder="주기명으로 검색"
                        onSearch={handleSearch}
                        style={{ width: 200 }}
                        allowClear
                    />
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleCreateCycle}
                    >
                        주기 생성
                    </Button>
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={handleRefresh}
                        loading={loading}
                    >
                        새로고침
                    </Button>
                </Space>
            </div>

            {/* 매치 주기 테이블 */}
            <Card title="매치 주기 목록">
                <Table
                    columns={getCycleTableColumns(handleEditCycle, handleToggleCycleStatus)}
                    dataSource={cyclesData?.list || []}
                    rowKey="id"
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: cyclesData?.total || 0,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total, range) =>
                            `${range[0]}-${range[1]} / 총 ${total}개`,
                    }}
                    onChange={handleTableChange}
                    loading={loading}
                    scroll={{ x: 1200 }}
                />
            </Card>

            {/* 주기 생성/수정 모달 */}
            <CycleFormModal
                visible={cycleModalVisible}
                onCancel={handleCloseModal}
                onSubmit={handleCycleSubmit}
                editingCycle={editingCycle}
                loading={loading}
            />
        </div>
    );
};

export default CycleManagementPanel; 