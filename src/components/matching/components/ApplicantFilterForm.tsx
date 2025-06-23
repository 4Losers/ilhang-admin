import React from 'react';
import { Card, Form, Select, DatePicker, Button, Space } from 'antd';
import { ApplicantFilter } from '../../../services/matching/types';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface ApplicantFilterFormProps {
    filter: ApplicantFilter;
    onSubmit: (values: any) => void;
    onReset: () => void;
}

const ApplicantFilterForm: React.FC<ApplicantFilterFormProps> = ({
    filter,
    onSubmit,
    onReset
}) => {
    const [form] = Form.useForm();

    const handleSubmit = (values: any) => {
        onSubmit(values);
    };

    const handleReset = () => {
        form.resetFields();
        onReset();
    };

    return (
        <Card size="small" style={{ marginBottom: '16px' }}>
            <Form
                form={form}
                layout="inline"
                onFinish={handleSubmit}
                initialValues={filter}
            >
                <Form.Item name="instanceId" label="회차">
                    <Select
                        placeholder="회차 선택"
                        style={{ width: 200 }}
                        allowClear
                    >
                        <Option value={1}>일간 매칭 1회차</Option>
                        <Option value={2}>일간 매칭 2회차</Option>
                        <Option value={3}>주간 매칭 1회차</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="status" label="상태">
                    <Select
                        placeholder="상태 선택"
                        style={{ width: 150 }}
                        allowClear
                    >
                        <Option value="WAITING">대기중</Option>
                        <Option value="ACCEPTED">수락완료</Option>
                        <Option value="CANCELLED">취소됨</Option>
                        <Option value="REJECTED">거절됨</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="dateRange" label="신청 기간">
                    <RangePicker />
                </Form.Item>

                <Form.Item>
                    <Space>
                        <Button type="primary" htmlType="submit">
                            검색
                        </Button>
                        <Button onClick={handleReset}>
                            초기화
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Card>
    );
};

export default ApplicantFilterForm; 