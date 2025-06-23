import { useState } from 'react';
import { Button, Form, Input, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, CrownOutlined } from '@ant-design/icons';
import { register } from '@/services/userService';
import { AdminRole } from '@/types/user';

const { Option } = Select;

const SignupPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values: {
    name: string;
    email: string;
    password: string;
    role: AdminRole;
  }) => {
    setLoading(true);
    try {
      await register(values);
      message.success('회원가입이 완료되었습니다. 로그인해주세요.');
      navigate('/login');
    } catch (error: any) {
      console.error('회원가입 실패:', error);
      const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
      message.error(`❌ ${errorMessage}`);
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
        maxWidth: '450px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '8px'
          }}>
            관리자 계정 생성
          </h1>
          <p style={{ color: '#666', margin: 0 }}>
            새로운 관리자 계정을 등록하세요
          </p>
        </div>

        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            label="이름"
            rules={[
              { required: true, message: '이름을 입력해주세요' },
              { min: 2, message: '이름은 최소 2자 이상이어야 합니다' },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="관리자 이름"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="이메일"
            rules={[
              { required: true, message: '이메일을 입력해주세요' },
              { type: 'email', message: '유효한 이메일 형식이 아닙니다' },
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="admin@example.com"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="비밀번호"
            rules={[
              { required: true, message: '비밀번호를 입력해주세요' },
              {
                pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?])[A-Za-z\d!@#$%^&*()_+\[\]{};':"\\|,.<>\/?]{8,}$/,
                message: '영문, 숫자, 특수문자를 포함한 8자 이상 비밀번호를 입력해주세요',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="비밀번호"
            />
          </Form.Item>

          <Form.Item
            name="role"
            label="권한"
            rules={[{ required: true, message: '권한을 선택해주세요' }]}
          >
            <Select
              placeholder="권한 선택"
              prefix={<CrownOutlined style={{ color: '#bfbfbf' }} />}
            >
              <Option value="일반 운영자">일반 운영자</Option>
              <Option value="최고 관리자">최고 관리자</Option>
            </Select>
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
              회원가입
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            <Button
              type="link"
              onClick={() => navigate('/login')}
              style={{ padding: 0, fontSize: '14px' }}
            >
              이미 계정이 있으신가요? 로그인
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignupPage;