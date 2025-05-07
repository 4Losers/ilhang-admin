import { Table, Tag, Button, Space } from 'antd';

const mockReports = [
  {
    id: 1,
    reportedType: '인증',
    reportedTarget: '홍길동의 6시 기상 인증',
    reason: '사진이 본인 인증이 아님',
    status: '처리 전',
  },
  {
    id: 2,
    reportedType: '유저',
    reportedTarget: '김영희',
    reason: '욕설 사용',
    status: '처리 완료',
  },
];

const ReportPage = () => {
  const handleResolve = (id: number) => {
    console.log(`신고 ${id} 처리 완료`);
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: '대상 유형', dataIndex: 'reportedType', key: 'reportedType' },
    { title: '신고 대상', dataIndex: 'reportedTarget', key: 'reportedTarget' },
    { title: '사유', dataIndex: 'reason', key: 'reason' },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '처리 완료' ? 'green' : 'orange'}>{status}</Tag>
      ),
    },
    {
      title: '조치',
      key: 'actions',
      render: (_: any, record: any) =>
        record.status === '처리 전' && (
          <Space>
            <Button type="primary" size="small" onClick={() => handleResolve(record.id)}>
              처리 완료
            </Button>
          </Space>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>신고 관리</h1>
      <Table dataSource={mockReports} columns={columns} rowKey="id" />
    </div>
  );
};

export default ReportPage;