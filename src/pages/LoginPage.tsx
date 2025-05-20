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
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await axiosClient.post<LoginResponse>('/admin/login', values);
      localStorage.setItem('accessToken', res.data.accessToken);
      message.success('✅ 로그인에 성공했습니다.');
      navigate('/');
    } catch (e: any) {
      // ✅ 세련된 Toast 알림 확실히 보이게
      message.error('❌ 아이디 또는 비밀번호가 올바르지 않습니다.', 2.5); // 2.5초 동안 표시

      // 🔻 이메일/비번 입력창에도 에러 강조
      form.setFields([
        {
          name: 'email',
          errors: [' '], // 비워도 붉은색 테두리 표시됨
        },
        {
          name: 'password',
          errors: ['아이디 또는 비밀번호가 잘못되었습니다.'],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 400, margin: '80px auto' }}
    >
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