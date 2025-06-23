import React from 'react';
import { Table, Pagination, Empty, Card, Space, Button, Tooltip } from 'antd';
import { TableProps } from 'antd/es/table';
import { ReloadOutlined } from '@ant-design/icons';

interface AdvancedTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
    data: T[];
    loading?: boolean;
    tableTitle?: string;
    subtitle?: string;
    pagination?: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize?: number) => void;
    };
    emptyText?: string;
    scroll?: { x?: number | string; y?: number | string };
    onRefresh?: () => void;
    refreshLoading?: boolean;
    actions?: Array<{
        key: string;
        label: string;
        type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
        icon?: React.ReactNode;
        onClick: () => void;
        loading?: boolean;
    }>;
    showHeader?: boolean;
    showActions?: boolean;
}

const AdvancedTable = <T extends Record<string, any>>({
    data,
    loading = false,
    tableTitle,
    subtitle,
    pagination,
    emptyText = '데이터가 없습니다.',
    scroll,
    onRefresh,
    refreshLoading = false,
    actions = [],
    showHeader = true,
    showActions = true,
    ...tableProps
}: AdvancedTableProps<T>) => {
    const renderHeader = () => {
        if (!showHeader && !tableTitle && !subtitle && !onRefresh && actions.length === 0) {
            return null;
        }

        return (
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
                padding: '16px 0',
                borderBottom: '1px solid #f0f0f0'
            }}>
                <div>
                    {tableTitle && (
                        <h3 style={{ margin: 0, marginBottom: 4, fontSize: 16, fontWeight: 600 }}>
                            {tableTitle}
                        </h3>
                    )}
                    {subtitle && (
                        <p style={{ margin: 0, fontSize: 14, color: '#8c8c8c' }}>
                            {subtitle}
                        </p>
                    )}
                </div>

                {showActions && (onRefresh || actions.length > 0) && (
                    <Space>
                        {onRefresh && (
                            <Tooltip title="새로고침">
                                <Button
                                    icon={<ReloadOutlined />}
                                    onClick={onRefresh}
                                    loading={refreshLoading}
                                    size="small"
                                />
                            </Tooltip>
                        )}

                        {actions.map((action) => (
                            <Button
                                key={action.key}
                                type={action.type || 'default'}
                                icon={action.icon}
                                onClick={action.onClick}
                                loading={action.loading}
                                size="small"
                            >
                                {action.label}
                            </Button>
                        ))}
                    </Space>
                )}
            </div>
        );
    };

    return (
        <Card bodyStyle={{ padding: 0 }}>
            {renderHeader()}

            <div style={{ padding: showHeader ? '0 24px 24px' : '24px' }}>
                <Table<T>
                    dataSource={data}
                    loading={loading}
                    rowKey={(record) => record.id || record.userId || record.cycleId}
                    pagination={false}
                    scroll={scroll}
                    locale={{
                        emptyText: (
                            <Empty
                                image={Empty.PRESENTED_IMAGE_SIMPLE}
                                description={emptyText}
                            />
                        ),
                    }}
                    {...tableProps}
                />

                {pagination && (
                    <div style={{
                        marginTop: 24,
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Pagination
                            current={pagination.current}
                            pageSize={pagination.pageSize}
                            total={pagination.total}
                            onChange={pagination.onChange}
                            showSizeChanger
                            showQuickJumper
                            showTotal={(total, range) => `${range[0]}-${range[1]} / 총 ${total}개`}
                        />
                    </div>
                )}
            </div>
        </Card>
    );
};

export default AdvancedTable; 