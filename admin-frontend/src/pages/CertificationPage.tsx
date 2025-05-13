import { Table, Button, Image, Space, Tag, Modal } from 'antd';
import { useEffect, useState } from 'react';
import { fetchCertifications, Certification } from '@/services/certificationService';

const CertificationPage = () => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [certs, setCerts] = useState<Certification[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCertifications();
        setCerts(data);
      } catch (e) {
        console.error('인증 데이터 로드 실패:', e);
      }
    };
    load();
  }, []);

  const handleApprove = (id: number) => {
    console.log(`인증 ${id} 승인`);
  };

  const handleReject = (id: number) => {
    console.log(`인증 ${id} 반려`);
  };

  const columns = [
    { title: '사용자', dataIndex: 'user', key: 'user' },
    { title: '미션명', dataIndex: 'mission', key: 'mission' },
    { title: '제출 시간', dataIndex: 'submittedAt', key: 'submittedAt' },
    {
      title: '인증 자료',
      dataIndex: 'imageUrl',
      key: 'image',
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
      render: (status: string) => (
        <Tag color={status === '대기' ? 'orange' : status === '승인됨' ? 'green' : 'red'}>
          {status}
        </Tag>
      ),
    },
    {
      title: '조치',
      key: 'actions',
      render: (_: any, record: Certification) =>
        record.status === '대기' && (
          <Space>
            <Button type="primary" size="small" onClick={() => handleApprove(record.id)}>
              승인
            </Button>
            <Button danger size="small" onClick={() => handleReject(record.id)}>
              반려
            </Button>
          </Space>
        ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>인증 관리</h1>
      <Table dataSource={certs} columns={columns} rowKey="id" />

      <Modal
        open={!!previewUrl}
        footer={null}
        onCancel={() => setPreviewUrl(null)}
        width={600}
      >
        {previewUrl && <Image src={previewUrl} width="100%" />}
      </Modal>
    </div>
  );
};

export default CertificationPage;
