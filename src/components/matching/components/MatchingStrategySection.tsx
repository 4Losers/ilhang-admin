import React from 'react';
import { Card, Form, Select, Space } from 'antd';
import {
    UserOutlined,
    TeamOutlined,
    ClockCircleOutlined
} from '@ant-design/icons';

const { Option } = Select;

const MatchingStrategySection: React.FC = () => {
    return (
        <Card size="small" title="매칭 전략" style={{ marginBottom: '16px' }}>
            <Form.Item
                name="matchingStrategy"
                label="매칭 알고리즘"
                rules={[{ required: true, message: '매칭 알고리즘을 선택해주세요' }]}
            >
                <Select placeholder="매칭 알고리즘 선택">
                    <Option value="SUCCESS_RATE">
                        <Space>
                            <UserOutlined />
                            성공률 기반 매칭
                        </Space>
                    </Option>
                    <Option value="RANDOM">
                        <Space>
                            <TeamOutlined />
                            랜덤 매칭
                        </Space>
                    </Option>
                    <Option value="LEVEL_BASED">
                        <Space>
                            <UserOutlined />
                            레벨 기반 매칭
                        </Space>
                    </Option>
                    <Option value="TIME_BASED">
                        <Space>
                            <ClockCircleOutlined />
                            시간대 기반 매칭
                        </Space>
                    </Option>
                </Select>
            </Form.Item>
        </Card>
    );
};

export default MatchingStrategySection; 