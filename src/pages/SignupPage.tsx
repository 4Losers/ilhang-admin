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
      await axiosClient.post('/admin', values);
      message.success('회원가입 성공');
      navigate('/login');
    } catch (e) {
      message.error('회원가입 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 400, margin: '80px auto' }}
    >
      <h2>회원가입</h2>

      <Form.Item
        name="name"
        label="이름"
        rules={[
          { required: true, message: '이름을 입력해주세요' },
          { min: 2, message: '이름은 최소 2자 이상이어야 합니다' },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="email"
        label="이메일"
        rules={[
          { required: true, message: '이메일을 입력해주세요' },
          { type: 'email', message: '유효한 이메일 형식이 아닙니다' },
        ]}
      >
        <Input />
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
        <Input.Password />
      </Form.Item>

      <Form.Item
        name="role"
        label="역할"
        rules={[{ required: true, message: '역할을 선택해주세요' }]}
      >
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