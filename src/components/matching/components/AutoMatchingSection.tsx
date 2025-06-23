import React from 'react';
import { Card, Form, Switch, InputNumber, Row, Col, Typography, Divider } from 'antd';

const { Text } = Typography;

const AutoMatchingSection: React.FC = () => {
    return (
        <Card size="small" title="자동 매칭 설정">
            <Form.Item
                name={['autoMatching', 'enabled']}
                valuePropName="checked"
            >
                <Switch checkedChildren="활성" unCheckedChildren="비활성" />
            </Form.Item>
            <Text>자동 매칭 활성화</Text>

            <Divider />

            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name={['autoMatching', 'delayMinutes']}
                        label="매칭 지연 시간 (분)"
                        rules={[{ required: true, message: '지연 시간을 입력해주세요' }]}
                    >
                        <InputNumber min={0} max={1440} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name={['autoMatching', 'maxRetries']}
                        label="최대 재시도 횟수"
                        rules={[{ required: true, message: '재시도 횟수를 입력해주세요' }]}
                    >
                        <InputNumber min={0} max={10} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};

export default AutoMatchingSection; 