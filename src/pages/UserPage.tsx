import { Table, Tag, Button, Space } from 'antd';

const mockUsers = [
  {
    id: 1,
    nickname: '홍길동',
    email: 'hong@test.com',
    joinedAt: '2025-01-15',
    status: '정상',
  },
  {
    id: 2,
    nickname: '김영희',
    email: 'kim@test.com',
    joinedAt: '2025-03-10',
    status: '정지됨',
  },
];

const UserPage = () => {
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
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => handleView(record.id)}>
            상세
          </Button>
          {record.status === '정상' ? (
            <Button danger size="small" onClick={() => handleBlock(record.id)}>
              정지
            </Button>
          ) : (
            <Button type="primary" size="small" onClick={() => handleUnblock(record.id)}>
              해제
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>유저 관리</h1>
      <Table dataSource={mockUsers} columns={columns} rowKey="id" />
    </div>
  );
};

export default UserPage;