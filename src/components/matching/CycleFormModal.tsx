import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Space, Button } from 'antd';
import { TimePicker } from 'antd';
import dayjs from 'dayjs';
import { CycleConfigResponse } from '../../services/matching/types';

const { Option } = Select;

interface CycleFormModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => void;
    editingCycle: CycleConfigResponse | null;
    loading: boolean;
}

const CycleFormModal: React.FC<CycleFormModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    editingCycle,
    loading
}) => {
    const [form] = Form.useForm();

    // 편집 모드일 때 폼 초기값 설정
    useEffect(() => {
        if (visible && editingCycle) {
            form.setFieldsValue({
                ...editingCycle,
                startTime: dayjs(editingCycle.startTime, 'HH:mm')
            });
        } else if (visible) {
            form.resetFields();
        }
    }, [visible, editingCycle, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSubmit(values);
        } catch (error) {
            console.error('폼 검증 실패:', error);
        }
    };

    return (
        <Modal
            title={editingCycle ? '매치 주기 수정' : '매치 주기 생성'}
            open={visible}
            onCancel={onCancel}
            footer={null}
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
            >
                <Form.Item
                    name="name"
                    label="주기명"
                    rules={[
                        { required: true, message: '주기명을 입력해주세요.' },
                        { min: 1, max: 50, message: '주기명은 1자 이상 50자 이하로 입력해주세요.' }
                    ]}
                >
                    <Input placeholder="예: 일간 도전, 주간 미션" />
                </Form.Item>

                <Form.Item
                    name="cycleType"
                    label="주기 타입"
                    rules={[{ required: true, message: '주기 타입을 선택해주세요.' }]}
                >
                    <Select placeholder="주기 타입을 선택하세요">
                        <Option value="DAILY">일간</Option>
                        <Option value="WEEKLY">주간</Option>
                        <Option value="MONTHLY">월간</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="startTime"
                    label="시작 시간"
                    rules={[{ required: true, message: '시작 시간을 입력해주세요.' }]}
                >
                    <TimePicker
                        format="HH:mm"
                        placeholder="시작 시간을 선택하세요"
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item
                    name="challengeAmount"
                    label="도전 금액"
                    rules={[
                        { required: true, message: '도전 금액을 입력해주세요.' },
                        { type: 'number', min: 1000, message: '도전 금액은 1,000원 이상이어야 합니다.' }
                    ]}
                >
                    <InputNumber
                        placeholder="도전 금액을 입력하세요"
                        style={{ width: '100%' }}
                        min={1000}
                    />
                </Form.Item>

                <Form.Item
                    name="maxParticipants"
                    label="최대 참가자 수"
                    rules={[
                        { required: true, message: '최대 참가자 수를 입력해주세요.' },
                        { type: 'number', min: 1, message: '최대 참가자 수는 1명 이상이어야 합니다.' }
                    ]}
                >
                    <InputNumber
                        placeholder="최대 참가자 수를 입력하세요"
                        style={{ width: '100%' }}
                        min={1}
                    />
                </Form.Item>

                <Form.Item
                    name="minParticipants"
                    label="최소 참가자 수"
                    rules={[
                        { required: true, message: '최소 참가자 수를 입력해주세요.' },
                        { type: 'number', min: 1, message: '최소 참가자 수는 1명 이상이어야 합니다.' }
                    ]}
                >
                    <InputNumber
                        placeholder="최소 참가자 수를 입력하세요"
                        style={{ width: '100%' }}
                        min={1}
                    />
                </Form.Item>

                <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
                    <Space>
                        <Button onClick={onCancel}>
                            취소
                        </Button>
                        <Button type="primary" onClick={handleSubmit} loading={loading}>
                            {editingCycle ? '수정' : '생성'}
                        </Button>
                    </Space>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CycleFormModal; 