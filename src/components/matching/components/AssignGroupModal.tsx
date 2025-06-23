import React from 'react';
import { Modal, Form, Select } from 'antd';
import { MatchApplicant } from '../../../services/matching/types';

const { Option } = Select;

interface AssignGroupModalProps {
    visible: boolean;
    onCancel: () => void;
    onSubmit: (values: any) => Promise<boolean>;
    selectedApplicant: MatchApplicant | null;
}

const AssignGroupModal: React.FC<AssignGroupModalProps> = ({
    visible,
    onCancel,
    onSubmit,
    selectedApplicant
}) => {
    const [form] = Form.useForm();

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            const success = await onSubmit(values);
            if (success) {
                form.resetFields();
            }
        } catch (error) {
            console.error('폼 검증 실패:', error);
        }
    };

    return (
        <Modal
            title="그룹 배정"
            open={visible}
            onOk={handleSubmit}
            onCancel={onCancel}
            width={500}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Form.Item
                    name="groupId"
                    label="배정할 그룹"
                    rules={[{ required: true, message: '그룹을 선택해주세요' }]}
                >
                    <Select placeholder="그룹 선택">
                        <Option value={1}>그룹 A</Option>
                        <Option value={2}>그룹 B</Option>
                        <Option value={3}>그룹 C</Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default AssignGroupModal; 