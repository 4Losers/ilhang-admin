import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { fetchReports, Report } from '@/services/reportService';

const ReportPage = () => {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchReports();
        setReports(data);
      } catch (e) {
        console.error('신고 데이터 로딩 실패:', e);
      }
    };
    load();
  }, []);

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
      render: (_: any, record: Report) =>
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
      <Table dataSource={reports} columns={columns} rowKey="id" />
    </div>
  );
};

export default ReportPage;
