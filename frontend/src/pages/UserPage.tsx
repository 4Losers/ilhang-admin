import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Spin } from 'antd';
import { fetchUsers, User } from '@/services/userService';

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (err) {
        console.error('유저 불러오기 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  const handleBlock = (id: number) => {
    console.log(`유저 ${id} 정지 처리`);
  };

  const handleUnblock = (id: number) => {
    console.log(`유저 ${id} 정지 해제`);
  };

  const handleView = (id: number) => {
    console.log(`유저 ${id} 상세 보기`);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '닉네임', dataIndex: 'nickname', key: 'nickname' },
    { title: '이메일', dataIndex: 'email', key: 'email' },
    { title: '가입일', dataIndex: 'joinedAt', key: 'joinedAt' },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '정상' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: '조치',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button size="small" onClick={() => handleView(record.id)}>상세</Button>
          {record.status === '정상' ? (
            <Button danger size="small" onClick={() => handleBlock(record.id)}>정지</Button>
          ) : (
            <Button type="primary" size="small" onClick={() => handleUnblock(record.id)}>해제</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>유저 관리</h1>
      {loading ? <Spin /> : <Table dataSource={users} columns={columns} rowKey="id" />}
    </div>
  );
};

export default UserPage;
