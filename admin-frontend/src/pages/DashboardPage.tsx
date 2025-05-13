import { useEffect, useState } from 'react';
import { Card, Col, Row, Spin } from 'antd';
import { fetchDashboardStats, DashboardStats } from '@/services/dashboardService';

const DashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const load = async () => {
    try {
      const data = await fetchDashboardStats();
      if (data) setStats(data);
    } catch (e) {
      console.error('대시보드 통계 로딩 실패:', e);
    } finally {
      setLoading(false);
    }
  };
  load();
}, []);

if (loading) return <Spin style={{ margin: 48 }} />;

if (!stats) {
  return <div style={{ padding: 24 }}>📭 통계 데이터가 없습니다.</div>;
}


  if (loading || !stats) return <Spin style={{ margin: 48 }} />;

  const displayStats = [
    { title: '총 유저 수', value: `${stats.totalUsers.toLocaleString()}명` },
    { title: '진행 중 미션 수', value: `${stats.activeMissions}개` },
    { title: '인증 승인률', value: `${Math.round(stats.certificationApprovalRate * 100)}%` },
    { title: '매칭 성공률', value: `${Math.round(stats.matchSuccessRate * 100)}%` },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>대시보드</h1>
      <Row gutter={16}>
        {displayStats.map((stat) => (
          <Col key={stat.title} xs={24} sm={12} md={6}>
            <Card bordered={false} style={{ textAlign: 'center' }}>
              <h3 style={{ marginBottom: 8 }}>{stat.title}</h3>
              <p style={{ fontSize: 24, fontWeight: 'bold' }}>{stat.value}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default DashboardPage;
