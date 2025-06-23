import React from 'react';
import { Card, Form, InputNumber, Row, Col } from 'antd';

const TeamSizeSection: React.FC = () => {
    return (
        <Card size="small" title="팀 크기 설정" style={{ marginBottom: '16px' }}>
            <Row gutter={16}>
                <Col span={8}>
                    <Form.Item
                        name={['teamSize', 'min']}
                        label="최소 팀원 수"
                        rules={[{ required: true, message: '최소 팀원 수를 입력해주세요' }]}
                    >
                        <InputNumber min={1} max={10} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name={['teamSize', 'max']}
                        label="최대 팀원 수"
                        rules={[{ required: true, message: '최대 팀원 수를 입력해주세요' }]}
                    >
                        <InputNumber min={1} max={10} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item
                        name={['teamSize', 'preferred']}
                        label="선호 팀원 수"
                        rules={[{ required: true, message: '선호 팀원 수를 입력해주세요' }]}
                    >
                        <InputNumber min={1} max={10} style={{ width: '100%' }} />
                    </Form.Item>
                </Col>
            </Row>
        </Card>
    );
};

export default TeamSizeSection; 