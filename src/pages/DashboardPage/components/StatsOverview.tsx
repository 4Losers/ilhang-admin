import React from 'react';
import { Row, Col } from 'antd';
import {
    UserOutlined,
    RocketOutlined,
    RiseOutlined,
    TeamOutlined,
} from '@ant-design/icons';
import StatCard from '@/components/common/StatCard';
import { DashboardStats } from '@/services/dashboardService';

interface StatsOverviewProps {
    stats: DashboardStats | null;
    todayNewUsers: number;
    weeklyTotalUsers: number;
    loading?: boolean;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
    stats,
    todayNewUsers,
    weeklyTotalUsers,
    loading = false,
}) => {
    if (!stats) {
        return null;
    }

    return (
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="총 사용자 수"
                    value={stats.totalUsers}
                    prefix={<UserOutlined style={{ color: '#1890ff' }} />}
                    suffix="명"
                    color="#1890ff"
                    loading={loading}
                />
            </Col>
            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="총 미션 템플릿 수"
                    value={stats.totalMissions}
                    prefix={<RocketOutlined style={{ color: '#52c41a' }} />}
                    suffix="개"
                    color="#52c41a"
                    loading={loading}
                />
            </Col>
            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="오늘 신규 가입"
                    value={todayNewUsers}
                    prefix={<RiseOutlined style={{ color: '#fa8c16' }} />}
                    suffix="명"
                    color="#fa8c16"
                    loading={loading}
                />
            </Col>
            <Col xs={24} sm={12} md={6}>
                <StatCard
                    title="최근 7일 신규 가입"
                    value={weeklyTotalUsers}
                    prefix={<TeamOutlined style={{ color: '#722ed1' }} />}
                    suffix="명"
                    color="#722ed1"
                    loading={loading}
                />
            </Col>
        </Row>
    );
};

export default StatsOverview; 