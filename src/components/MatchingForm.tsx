import { Modal, Form, Input, InputNumber, DatePicker, Switch } from 'antd';
import { CreateMatchingRequest, Matching } from '../services/matchingService';
import dayjs from 'dayjs';
import { useEffect } from 'react';

interface MatchingFormProps {
    open: boolean;
    onCancel: () => void;
    onFinish: (values: CreateMatchingRequest) => void;
    initialValues?: Matching | null;
}

const MatchingForm = ({ open, onCancel, onFinish, initialValues }: MatchingFormProps) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue({
                    ...initialValues,
                    baseStartTime: dayjs(initialValues.baseStartTime),
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ active: true }); // 생성 시 기본값
            }
        }
    }, [initialValues, form, open]);

    const handleOk = () => {
        form.validateFields()
            .then(values => {
                const payload = {
                    ...values,
                    baseStartTime: values.baseStartTime.toISOString(),
                };
                onFinish(payload);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    return (
        <Modal
            open={open}
            title={initialValues ? '매칭 주기 수정' : '매칭 주기 생성'}
            onCancel={onCancel}
            onOk={handleOk}
            destroyOnClose
            okText={initialValues ? '수정' : '생성'}
            cancelText="취소"
        >
            <Form form={form} layout="vertical" name="matching_form" initialValues={{ active: true }}>
                <Form.Item name="cycleName" label="주기명" rules={[{ required: true, message: '주기명을 입력하세요.' }]}>
                    <Input />
                </Form.Item>
                <Form.Item name="description" label="설명" rules={[{ required: true, message: '설명을 입력하세요.' }]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item name="baseStartTime" label="기준 시작일" rules={[{ required: true, message: '기준 시작일을 선택하세요.' }]}>
                    <DatePicker showTime format="YYYY-MM-DD HH:mm" />
                </Form.Item>
                <Form.Item name="instanceIntervalMinutes" label="인스턴스 간격 (분)" rules={[{ required: true, message: '인스턴스 간격을 입력하세요.' }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="applicationCloseMinutes" label="신청 마감 (시작 전, 분)" rules={[{ required: true, message: '신청 마감 시간을 입력하세요.' }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="matchingExecMinutes" label="매칭 실행 (시작 전, 분)" rules={[{ required: true, message: '매칭 실행 시간을 입력하세요.' }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="matchStartMinutes" label="매칭 시작 (시작 후, 분)" rules={[{ required: true, message: '매칭 시작 시간을 입력하세요.' }]}>
                    <InputNumber min={0} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="matchDurationMinutes" label="매칭 지속 (분)" rules={[{ required: true, message: '매칭 지속 시간을 입력하세요.' }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="defaultLifePoint" label="기본 생명 점수" rules={[{ required: true, message: '기본 생명 점수를 입력하세요.' }]}>
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item name="active" label="활성화" valuePropName="checked">
                    <Switch />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default MatchingForm; 