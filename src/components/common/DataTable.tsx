import { Table, Pagination, Empty } from 'antd';
import { TableProps } from 'antd/es/table';

interface DataTableProps<T> extends Omit<TableProps<T>, 'pagination'> {
    data: T[];
    loading?: boolean;
    pagination?: {
        current: number;
        pageSize: number;
        total: number;
        onChange: (page: number, pageSize?: number) => void;
    };
    emptyText?: string;
    scroll?: { x?: number | string; y?: number | string };
}

const DataTable = <T extends Record<string, any>>({
    data,
    loading = false,
    pagination,
    emptyText = '데이터가 없습니다.',
    scroll,
    ...tableProps
}: DataTableProps<T>) => {
    return (
        <div>
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
                <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    onChange={pagination.onChange}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total, range) => `${range[0]}-${range[1]} / 총 ${total}개`}
                    style={{ marginTop: 24, textAlign: 'center' }}
                />
            )}
        </div>
    );
};

export default DataTable; 