import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axiosClient from '@/services/axiosClient';

type LoginResponse = {
  accessToken: string;
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await axiosClient.post<LoginResponse>('/admin/login', values);
      localStorage.setItem('accessToken', res.data.accessToken);
      message.success('로그인 성공');
      navigate('/');
    } catch (e) {
      message.error('로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onFinish={onFinish} layout="vertical" style={{ maxWidth: 400, margin: '80px auto' }}>
      <h2>로그인</h2>
      <Form.Item name="email" label="이메일" rules={[{ required: true }]}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="비밀번호" rules={[{ required: true }]}>
        <Input.Password />
      </Form.Item>
      <Button htmlType="submit" type="primary" loading={loading} block>
        로그인
      </Button>

      <Button
        type="link"
        onClick={() => navigate('/signup')}
        block
        style={{ marginTop: 12 }}
      >
        아직 계정이 없으신가요? 회원가입
      </Button>
    </Form>
  );
};

export default LoginPage;