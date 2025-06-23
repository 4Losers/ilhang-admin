import { useEffect, useState } from 'react';
import { Table, Button, message } from 'antd';
import { fetchReports, Report } from '@/services/reportService';
import PageLayout from '@/components/Layout/PageLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';

const ReportPage = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const data = await fetchReports();
      setReports(data);
    } catch (e) {
      console.error('신고 데이터 로딩 실패:', e);
      message.error('신고 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: number) => {
    try {
      // TODO: 실제 처리 완료 API 호출
      console.log(`신고 ${id} 처리 완료`);
      message.success('신고가 처리 완료되었습니다.');
      loadReports();
    } catch (error) {
      message.error('신고 처리에 실패했습니다.');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '대상 유형',
      dataIndex: 'reportedType',
      key: 'reportedType',
      width: 120,
    },
    {
      title: '신고 대상',
      dataIndex: 'reportedTarget',
      key: 'reportedTarget',
      width: 150,
    },
    {
      title: '사유',
      dataIndex: 'reason',
      key: 'reason',
      width: 200,
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <StatusBadge status={status} />
      ),
    },
    {
      title: '조치',
      key: 'actions',
      width: 120,
      render: (_: any, record: Report) =>
        record.status === '처리 전' && (
          <Button
            type="primary"
            size="small"
            onClick={() => handleResolve(record.id)}
          >
            처리 완료
          </Button>
        ),
    },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="🚨 신고 관리"
        subtitle="사용자 신고 내역을 확인하고 처리하세요"
        onRefresh={loadReports}
        refreshLoading={loading}
      />

      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: 24,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
      }}>
        <Table
          dataSource={reports}
          columns={columns}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}개`,
          }}
          scroll={{ x: 800 }}
        />
      </div>
    </PageLayout>
  );
};

export default ReportPage;
