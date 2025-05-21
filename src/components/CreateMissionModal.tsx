// src/components/CreateMissionModal.tsx
import { Modal, Form, Input, Select, InputNumber, message } from 'antd';
import { createMission, CreateMissionRequest } from '@/services/missionService';
import { useState } from 'react';

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateMissionModal = ({ open, onClose, onSuccess }: Props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    const handleOk = async () => {
        try {
            const values = await form.validateFields();
            setLoading(true);
            await createMission(values);
            message.success('미션이 생성되었습니다!');
            form.resetFields();
            onSuccess(); // 부모에서 미션 목록 다시 불러오도록
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="미션 만들기"
            open={open}
            onCancel={onClose}
            onOk={handleOk}
            confirmLoading={loading}
        >
            <Form layout="vertical" form={form}>
                <Form.Item label="카테고리 ID" name="categoryId" rules={[{ required: true }]}>
                    <InputNumber min={0} />
                </Form.Item>
                <Form.Item label="제목" name="title" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="설명" name="description" rules={[{ required: true }]}>
                    <Input.TextArea rows={3} />
                </Form.Item>
                <Form.Item label="타입" name="type" rules={[{ required: true }]}>
                    <Select>
                        <Select.Option value="CATEGORY">단일미션:CATEGORY</Select.Option>
                        <Select.Option value="SEQUENTIAL">연계미션:SEQUENTIAL</Select.Option>
                        <Select.Option value="MIXED">복합미션:MIXED</Select.Option>
                    </Select>
                </Form.Item>
                <Form.Item label="썸네일 URL" name="thumbnailUrl" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default CreateMissionModal;