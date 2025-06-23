import React from 'react';
import { Card, Form, Select, DatePicker, Button, Space } from 'antd';
import { LogFilter } from '../../../services/matching/types';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface LogFilterFormProps {
    filter: LogFilter;
    onSubmit: (values: any) => void;
    onReset: () => void;
}

const LogFilterForm: React.FC<LogFilterFormProps> = ({
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
                <Form.Item name="adminId" label="관리자">
                    <Select
                        placeholder="관리자 선택"
                        style={{ width: 150 }}
                        allowClear
                    >
                        <Option value={1}>관리자A</Option>
                        <Option value={2}>관리자B</Option>
                        <Option value={3}>관리자C</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="action" label="액션">
                    <Select
                        placeholder="액션 선택"
                        style={{ width: 150 }}
                        allowClear
                    >
                        <Option value="GROUP_CANCEL">그룹 취소</Option>
                        <Option value="TEAM_CANCEL">팀 취소</Option>
                        <Option value="USER_DROP">사용자 탈락</Option>
                        <Option value="MANUAL_MATCH">수동 매칭</Option>
                        <Option value="SETTING_CHANGE">설정 변경</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="targetType" label="대상 타입">
                    <Select
                        placeholder="대상 타입 선택"
                        style={{ width: 150 }}
                        allowClear
                    >
                        <Option value="GROUP">그룹</Option>
                        <Option value="TEAM">팀</Option>
                        <Option value="USER">사용자</Option>
                        <Option value="INSTANCE">회차</Option>
                        <Option value="CYCLE">주기</Option>
                    </Select>
                </Form.Item>

                <Form.Item name="dateRange" label="기간">
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

export default LogFilterForm; 