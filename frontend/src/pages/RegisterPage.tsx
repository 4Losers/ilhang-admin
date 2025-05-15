import { Button, Form, Input, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axiosClient from '@/services/axiosClient';

const { Option } = Select;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await axiosClient.post('/admin/register', values);
      message.success('회원가입 성공');
      navigate('/login');
    } catch (e) {
      message.error('회원가입 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical" style={{ maxWidth: 400, margin: '80px auto' }}>
      <h2>회원가입</h2>
      <Form.Item name="name" label="이름" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="email" label="이메일" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="비밀번호" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Form.Item name="role" label="역할" rules={[{ required: true }]}>
        <Select placeholder="역할 선택">
          <Option value="최고 관리자">최고 관리자</Option>
          <Option value="일반 운영자">일반 운영자</Option>
        </Select>
      </Form.Item>
      <Button htmlType="submit" type="primary" loading={loading} block>
        회원가입
      </Button>
    </Form>
  );
};

export default RegisterPage;
