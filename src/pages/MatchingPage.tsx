import { Table, Tag, Button, Space } from 'antd';

const mockMatchings = [
  {
    id: 1,
    cycleName: '일간 매칭',
    matchStart: '2025-05-01 06:00',
    matchEnd: '2025-05-01 22:00',
    status: '진행중',
  },
  {
    id: 2,
    cycleName: '주간 매칭',
    matchStart: '2025-04-28 00:00',
    matchEnd: '2025-05-04 23:59',
    status: '종료',
  },
];

const MatchingPage = () => {
  const handleViewTeams = (id: number) => {
    console.log(`매칭 ${id}의 팀 구성 보기`);
  };

  const columns = [
    { title: '회차 ID', dataIndex: 'id', key: 'id' },
    { title: '매칭 주기', dataIndex: 'cycleName', key: 'cycleName' },
    { title: '시작일', dataIndex: 'matchStart', key: 'matchStart' },
    { title: '종료일', dataIndex: 'matchEnd', key: 'matchEnd' },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = status === '진행중' ? 'green' : status === '종료' ? 'gray' : 'orange';
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: '조치',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" onClick={() => handleViewTeams(record.id)}>
            팀 구성 보기
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>매칭 관리</h1>
      <Table dataSource={mockMatchings} columns={columns} rowKey="id" />
    </div>
  );
};

export default MatchingPage;