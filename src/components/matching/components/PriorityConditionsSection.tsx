import React from 'react';
import { Card, Form, Switch, Row, Col, Typography } from 'antd';

const { Text } = Typography;

const PriorityConditionsSection: React.FC = () => {
    return (
        <Card size="small" title="우선순위 조건" style={{ marginBottom: '16px' }}>
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item
                        name={['priorityConditions', 'highSuccessRate']}
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="활성" unCheckedChildren="비활성" />
                    </Form.Item>
                    <Text>성공률 높은 사용자 우선</Text>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name={['priorityConditions', 'similarLevel']}
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="활성" unCheckedChildren="비활성" />
                    </Form.Item>
                    <Text>비슷한 레벨 사용자 우선</Text>
                </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '16px' }}>
                <Col span={12}>
                    <Form.Item
                        name={['priorityConditions', 'timeZone']}
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="활성" unCheckedChildren="비활성" />
                    </Form.Item>
                    <Text>같은 시간대 사용자 우선</Text>
                </Col>
                <Col span={12}>
                    <Form.Item
                        name={['priorityConditions', 'language']}
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="활성" unCheckedChildren="비활성" />
                    </Form.Item>
                    <Text>같은 언어 사용자 우선</Text>
                </Col>
            </Row>
        </Card>
    );
};

export default PriorityConditionsSection; 