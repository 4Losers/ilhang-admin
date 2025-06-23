import React from 'react';
import { Form, Input, Select, DatePicker, Button, Space, Card } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface FilterOption {
    value: string;
    label: string;
}

interface SearchFilterProps {
    filters: {
        name: string;
        label: string;
        type: 'input' | 'select' | 'dateRange';
        options?: FilterOption[];
        placeholder?: string;
    }[];
    onSearch: (values: any) => void;
    onReset: () => void;
    loading?: boolean;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
    filters,
    onSearch,
    onReset,
    loading = false,
}) => {
    const [form] = Form.useForm();

    const handleSearch = (values: any) => {
        // 날짜 범위 처리
        if (values.dateRange) {
            values.startDate = values.dateRange[0]?.format('YYYY-MM-DD');
            values.endDate = values.dateRange[1]?.format('YYYY-MM-DD');
            delete values.dateRange;
        }
        onSearch(values);
    };

    const handleReset = () => {
        form.resetFields();
        onReset();
    };

    const renderFilterField = (filter: any) => {
        switch (filter.type) {
            case 'input':
                return (
                    <Input
                        placeholder={filter.placeholder || `${filter.label}을(를) 입력하세요`}
                        allowClear
                    />
                );
            case 'select':
                return (
                    <Select
                        placeholder={filter.placeholder || `${filter.label}을(를) 선택하세요`}
                        allowClear
                    >
                        {filter.options?.map((option: FilterOption) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                );
            case 'dateRange':
                return <RangePicker style={{ width: '100%' }} />;
            default:
                return null;
        }
    };

    return (
        <Card style={{ marginBottom: 24 }}>
            <Form
                form={form}
                layout="inline"
                onFinish={handleSearch}
                style={{ marginBottom: 0 }}
            >
                {filters.map((filter) => (
                    <Form.Item key={filter.name} name={filter.name} label={filter.label}>
                        {renderFilterField(filter)}
                    </Form.Item>
                ))}
                <Form.Item>
                    <Space>
                        <Button
                            type="primary"
                            htmlType="submit"
                            icon={<SearchOutlined />}
                            loading={loading}
                        >
                            검색
                        </Button>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleReset}
                            disabled={loading}
                        >
                            초기화
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default SearchFilter; 