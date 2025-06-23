import { useEffect, useState } from 'react';
import { Table, Button, Image, Space, Modal, message } from 'antd';
import { fetchCertifications, Certification } from '@/services/certificationService';
import PageLayout from '@/components/Layout/PageLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusBadge from '@/components/common/StatusBadge';

const CertificationPage = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCertifications();
  }, []);

  const loadCertifications = async () => {
    try {
      setLoading(true);
      const data = await fetchCertifications();
      setCerts(data);
    } catch (e) {
      console.error('인증 데이터 로드 실패:', e);
      message.error('인증 데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      // TODO: 실제 승인 API 호출
      console.log(`인증 ${id} 승인`);
      message.success('인증이 승인되었습니다.');
      loadCertifications();
    } catch (error) {
      message.error('인증 승인에 실패했습니다.');
    }
  };

  const handleReject = async (id: number) => {
    try {
      // TODO: 실제 반려 API 호출
      console.log(`인증 ${id} 반려`);
      message.success('인증이 반려되었습니다.');
      loadCertifications();
    } catch (error) {
      message.error('인증 반려에 실패했습니다.');
    }
  };

  const columns = [
    {
      title: '사용자',
      dataIndex: 'user',
      key: 'user',
      width: 120,
    },
    {
      title: '미션명',
      dataIndex: 'mission',
      key: 'mission',
      width: 200,
    },
    {
      title: '제출 시간',
      dataIndex: 'submittedAt',
      key: 'submittedAt',
      width: 150,
      render: (date: string) => new Date(date).toLocaleString('ko-KR'),
    },
    {
      title: '인증 자료',
      dataIndex: 'imageUrl',
      key: 'image',
      width: 100,
      render: (url: string) => (
        <Image
          src={url}
          width={50}
          height={50}
          style={{ objectFit: 'cover', cursor: 'pointer' }}
          preview={false}
          onClick={() => setPreviewUrl(url)}
        />
      ),
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
      width: 150,
      render: (_: any, record: Certification) =>
        record.status === '대기' && (
          <Space>
            <Button
              type="primary"
              size="small"
              onClick={() => handleApprove(record.id)}
            >
              승인
            </Button>
            <Button
              danger
              size="small"
              onClick={() => handleReject(record.id)}
            >
              반려
            </Button>
          </Space>
        ),
    },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="✅ 인증 관리"
        subtitle="사용자 미션 인증 요청을 검토하고 처리하세요"
        onRefresh={loadCertifications}
        refreshLoading={loading}
      />

      <div style={{
        background: '#fff',
        borderRadius: 8,
        padding: 24,
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)'
      }}>
        <Table
          dataSource={certs}
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

      <Modal
        open={!!previewUrl}
        footer={null}
        onCancel={() => setPreviewUrl(null)}
        width={600}
        title="인증 자료 미리보기"
      >
        {previewUrl && <Image src={previewUrl} width="100%" />}
      </Modal>
    </PageLayout>
  );
};

export default CertificationPage;
