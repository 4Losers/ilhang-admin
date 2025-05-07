import { Table, Tag, Button, Space } from 'antd';

const mockMissions = [
  {
    id: 1,
    groupName: '출근 전 30분 독서',
    challengePoint: 1000,
    period: '매일',
    status: '활성',
  },
  {
    id: 2,
    groupName: '하루 만보 걷기',
    challengePoint: 500,
    period: '매주',
    status: '비활성',
  },
];

const MissionPage = () => {
  const handleEdit = (id: number) => {
    console.log(`미션 ${id} 수정`);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '미션명', dataIndex: 'groupName', key: 'groupName' },
    { title: '도전금', dataIndex: 'challengePoint', key: 'challengePoint' },
    { title: '주기', dataIndex: 'period', key: 'period' },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '활성' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: '조치',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record.id)}>
            수정
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>미션 관리</h1>
        <Button type="primary" size="middle">신규 등록</Button>
      </div>
      <Table dataSource={mockMissions} columns={columns} rowKey="id" />
    </div>
  );
};

export default MissionPage;