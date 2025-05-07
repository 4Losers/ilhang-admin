import { Table, Tag, Button, Space } from 'antd';

const mockAdmins = [
  {
    id: 1,
    name: '관리자1',
    email: 'admin1@ilhang.com',
    role: '최고 관리자',
  },
  {
    id: 2,
    name: '운영자2',
    email: 'admin2@ilhang.com',
    role: '일반 운영자',
  },
];

const AdminPage = () => {
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
      render: (_: any, record: any) =>
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
      <Table dataSource={mockAdmins} columns={columns} rowKey="id" />
    </div>
  );
};

export default AdminPage;