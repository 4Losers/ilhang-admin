import React from 'react';
import { Card, Row, Col } from 'antd';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { DashboardStats } from '@/services/dashboardService';

interface MissionStatsChartProps {
    stats: DashboardStats | null;
    weeklyTotalUsers: number;
}

const MissionStatsChart: React.FC<MissionStatsChartProps> = ({
    stats,
    weeklyTotalUsers,
}) => {
    if (!stats) {
        return null;
    }

    // 도넛 차트용 데이터 (최근 7일 vs 이전)
    const pieData = [
        { name: '최근 7일', value: weeklyTotalUsers, color: '#1890ff' },
        { name: '이전', value: Math.max(0, stats.totalUsers - weeklyTotalUsers), color: '#f0f0f0' }
    ];

    // 미션 통계 바 차트 데이터 (예시)
    const missionData = [
        { category: '운동', count: stats.totalMissions * 0.3 },
        { category: '학습', count: stats.totalMissions * 0.25 },
        { category: '취미', count: stats.totalMissions * 0.2 },
        { category: '생활', count: stats.totalMissions * 0.15 },
        { category: '기타', count: stats.totalMissions * 0.1 },
    ];

    return (
        <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
                <Card title="👥 사용자 분포" bordered={false}>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
            </Col>

            <Col xs={24} lg={12}>
                <Card title="📊 미션 카테고리별 분포" bordered={false}>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={missionData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#52c41a" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </Col>
        </Row>
    );
};

export default MissionStatsChart; 