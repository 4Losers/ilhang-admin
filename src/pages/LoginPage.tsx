import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '@/services/userService';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await login(values.email, values.password);

      // 토큰 저장
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // 사용자 정보 저장 (선택사항)
      localStorage.setItem('userInfo', JSON.stringify(response.user));

      message.success('✅ 로그인에 성공했습니다.');
      navigate('/');
    } catch (error: any) {
      console.error('로그인 실패:', error);

      // 세련된 에러 메시지
      const errorMessage = error.response?.data?.message ||
        '아이디 또는 비밀번호가 올바르지 않습니다.';
      message.error(`❌ ${errorMessage}`, 2.5);

      // 폼 필드에 에러 표시
      form.setFields([
        {
          name: 'email',
          errors: [' '],
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: '#fff',
        padding: '40px',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '8px'
          }}>
            일행 관리자
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            관리자 계정으로 로그인하세요
          </p>
        </div>

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            label="이메일"
            rules={[
              { required: true, message: '이메일을 입력해주세요' },
              { type: 'email', message: '유효한 이메일 형식이 아닙니다' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="admin@example.com"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="비밀번호"
            rules={[{ required: true, message: '비밀번호를 입력해주세요' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="비밀번호"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: '16px' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: '48px',
                fontSize: '16px',
                fontWeight: '500'
              }}
            >
              로그인
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Button
              type="link"
              onClick={() => navigate('/signup')}
              style={{ padding: 0, fontSize: '14px' }}
            >
              아직 계정이 없으신가요? 회원가입
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;