import React, { useEffect, useState } from 'react';
import { Button, Space, Modal, message, Form, Input, Select } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  CrownOutlined,
  SettingOutlined
} from '@ant-design/icons';
import { fetchAdmins, createAdmin, deleteAdmin } from '@/services/userService';
import { Admin, AdminRole } from '@/types/user';
import PageLayout from '@/components/Layout/PageLayout';
import PageHeader from '@/components/common/PageHeader';
import SearchFilter from '@/components/common/SearchFilter';
import StatusBadge from '@/components/common/StatusBadge';
import dayjs from 'dayjs';

const { Option } = Select;

interface Column {
  title: string;
  key: string;
  dataIndex?: keyof Admin;
  width?: number;
  render?: (value: any, record: Admin) => React.ReactNode;
}

const AdminPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form] = Form.useForm();

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const data = await fetchAdmins();
      setAdmins(data);
    } catch (error) {
      console.error('운영자 목록 불러오기 실패:', error);
      message.error('운영자 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const handleSearch = (values: any) => {
    // 검색 기능 구현
    console.log('검색:', values);
  };

  const handleReset = () => {
    loadAdmins();
  };

  const handleCreate = () => {
    setCreateModalVisible(true);
    form.resetFields();
  };

  const handleCreateSubmit = async (values: any) => {
    try {
      setCreateLoading(true);
      await createAdmin(values);
      message.success('운영자 계정이 생성되었습니다.');
      setCreateModalVisible(false);
      loadAdmins();
    } catch (error) {
      message.error('운영자 계정 생성에 실패했습니다.');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDelete = async (admin: Admin) => {
    if (admin.role === '최고 관리자') {
      message.warning('최고 관리자는 삭제할 수 없습니다.');
      return;
    }

    Modal.confirm({
      title: '운영자 삭제',
      content: `정말로 "${admin.name}" 운영자를 삭제하시겠습니까?`,
      okText: '삭제',
      okType: 'danger',
      cancelText: '취소',
      onOk: async () => {
        try {
          await deleteAdmin(admin.id);
          message.success('운영자가 삭제되었습니다.');
          loadAdmins();
        } catch (error) {
          message.error('운영자 삭제에 실패했습니다.');
        }
      },
    });
  };

  const searchFilters = [
    {
      name: 'keyword',
      label: '검색',
      type: 'input' as const,
      placeholder: '이름 또는 이메일',
    },
    {
      name: 'role',
      label: '권한',
      type: 'select' as const,
      options: [
        { value: '최고 관리자', label: '최고 관리자' },
        { value: '일반 운영자', label: '일반 운영자' },
      ],
    },
    {
      name: 'isActive',
      label: '활성 상태',
      type: 'select' as const,
      options: [
        { value: 'true', label: '활성' },
        { value: 'false', label: '비활성' },
      ],
    },
  ];

  const columns: Column[] = [
    {
      title: '아이콘',
      key: 'icon',
      width: 60,
      render: (_, admin: Admin) => (
        admin.role === '최고 관리자' ?
          <CrownOutlined style={{ fontSize: 20, color: '#faad14' }} /> :
          <SettingOutlined style={{ fontSize: 20, color: '#1890ff' }} />
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '이름',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '이메일',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '권한',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: AdminRole) => (
        <StatusBadge
          status={role}
          type={role === '최고 관리자' ? 'active' : 'normal'}
        />
      ),
    },
    {
      title: '생성일',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '마지막 로그인',
      dataIndex: 'lastLoginAt',
      key: 'lastLoginAt',
      width: 120,
      render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
    },
    {
      title: '상태',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive: boolean) => (
        <StatusBadge
          status={isActive ? '활성' : '비활성'}
          type={isActive ? 'active' : 'inactive'}
        />
      ),
    },
    {
      title: '조치',
      key: 'actions',
      width: 100,
      render: (_, admin: Admin) => (
        admin.role !== '최고 관리자' && (
          <Button
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(admin)}
          >
            삭제
          </Button>
        )
      ),
    },
  ];

  const renderCell = (column: Column, admin: Admin) => {
    if (column.render) {
      const value = column.dataIndex ? admin[column.dataIndex] : undefined;
      return column.render(value, admin);
    }
    if (column.dataIndex) {
      return admin[column.dataIndex];
    }
    return null;
  };

  return (
    <PageLayout>
      <PageHeader
        title="⚙️ 운영자 관리"
        subtitle="시스템 운영자 계정을 관리하세요"
        actions={[
          {
            key: 'create',
            label: '운영자 추가',
            type: 'primary',
            icon: <PlusOutlined />,
            onClick: handleCreate,
          }
        ]}
        onRefresh={loadAdmins}
        refreshLoading={loading}
      />

      {/* 검색 필터 */}
      <SearchFilter
        filters={searchFilters}
        onSearch={handleSearch}
        onReset={handleReset}
        loading={loading}
      />

      {/* 운영자 테이블 */}
      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: 24,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#fafafa' }}>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    padding: '12px 8px',
                    textAlign: 'left',
                    borderBottom: '1px solid #f0f0f0',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                {columns.map((column) => (
                  <td
                    key={column.key}
                    style={{
                      padding: '12px 8px',
                      textAlign: 'left',
                    }}
                  >
                    {renderCell(column, admin)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            데이터를 불러오는 중...
          </div>
        )}

        {!loading && admins.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
            운영자 데이터가 없습니다.
          </div>
        )}
      </div>

      {/* 운영자 생성 모달 */}
      <Modal
        title="운영자 추가"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        confirmLoading={createLoading}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateSubmit}
        >
          <Form.Item
            name="name"
            label="이름"
            rules={[{ required: true, message: '이름을 입력해주세요' }]}
          >
            <Input placeholder="운영자 이름" />
          </Form.Item>

          <Form.Item
            name="email"
            label="이메일"
            rules={[
              { required: true, message: '이메일을 입력해주세요' },
              { type: 'email', message: '올바른 이메일 형식이 아닙니다' }
            ]}
          >
            <Input placeholder="운영자 이메일" />
          </Form.Item>

          <Form.Item
            name="role"
            label="권한"
            rules={[{ required: true, message: '권한을 선택해주세요' }]}
          >
            <Select placeholder="권한 선택">
              <Option value="일반 운영자">일반 운영자</Option>
              <Option value="최고 관리자">최고 관리자</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={createLoading}>
                생성
              </Button>
              <Button onClick={() => setCreateModalVisible(false)}>
                취소
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </PageLayout>
  );
};

export default AdminPage;
