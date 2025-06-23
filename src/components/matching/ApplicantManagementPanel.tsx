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
import { useApplicantManagement } from './hooks/useApplicantManagement';
import { getApplicantTableColumns } from './utils/applicantTableColumns';
import ApplicantFilterForm from './components/ApplicantFilterForm';
import AssignGroupModal from './components/AssignGroupModal';

interface ApplicantManagementPanelProps {
    className?: string;
}

const ApplicantManagementPanel: React.FC<ApplicantManagementPanelProps> = ({ className }) => {
    const {
        loading,
        applicants,
        total,
        currentPage,
        pageSize,
        filter,
        filterVisible,
        assignModalVisible,
        selectedApplicant,
        handleRefresh,
        handlePageChange,
        handleFilterSubmit,
        handleFilterReset,
        handleStatusChange,
        handleAssignGroup,
        handleAssignSubmit,
        handleCloseAssignModal,
        toggleFilterVisible,
    } = useApplicantManagement();

    return (
        <div className={`applicant-management-panel ${className || ''}`}>
            <Card
                title="신청자 관리"
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
                    <ApplicantFilterForm
                        filter={filter}
                        onSubmit={handleFilterSubmit}
                        onReset={handleFilterReset}
                    />
                )}

                {/* 테이블 */}
                <Table
                    columns={getApplicantTableColumns(handleStatusChange, handleAssignGroup)}
                    dataSource={applicants}
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

            {/* 그룹 배정 모달 */}
            <AssignGroupModal
                visible={assignModalVisible}
                onCancel={handleCloseAssignModal}
                onSubmit={handleAssignSubmit}
                selectedApplicant={selectedApplicant}
            />
        </div>
    );
};

export default ApplicantManagementPanel; 