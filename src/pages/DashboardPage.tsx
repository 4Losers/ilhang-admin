import { Card, Col, Row } from 'antd';

const DashboardPage = () => {
  const stats = [
    { title: '총 유저 수', value: '1,024명' },
    { title: '진행 중 미션 수', value: '58개' },
    { title: '인증 승인률', value: '93%' },
    { title: '매칭 성공률', value: '82%' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>대시보드</h1>
      <Row gutter={16}>
        {stats.map((stat) => (
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