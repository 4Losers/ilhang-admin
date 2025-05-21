import { useEffect, useState } from 'react';
import { Table, Tag, Button } from 'antd';
import { fetchAdmins, Admin } from '@/services/adminService';

const AdminPage = () => {
  const [admins, setAdmins] = useState<Admin[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAdmins();
        setAdmins(data);
      } catch (e) {
        console.error('운영자 목록 불러오기 실패:', e);
      }
    };
    load();
  }, []);

  const handleRemove = (id: number) => {
    console.log(`운영자 ${id} 삭제`);
  };

  const handleCreate = () => {
    console.log('신규 운영자 등록');
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '이름', dataIndex: 'name', key: 'name' },
    { title: '이메일', dataIndex: 'email', key: 'email' },
    {
      title: '권한',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === '최고 관리자' ? 'blue' : 'gold'}>{role}</Tag>
      ),
    },
    {
      title: '조치',
      key: 'actions',
      render: (_: any, record: Admin) =>
        record.role !== '최고 관리자' && (
          <Button danger size="small" onClick={() => handleRemove(record.id)}>
            삭제
          </Button>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>운영자 계정 관리</h1>
        <Button type="primary" onClick={handleCreate}>
          계정 등록
        </Button>
      </div>
      <Table dataSource={admins} columns={columns} rowKey="id" />
    </div>
  );
};

export default AdminPage;
