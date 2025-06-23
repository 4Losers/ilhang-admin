import React from 'react';
import { Card, Alert } from 'antd';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { DailyStats } from '@/services/dashboardService';

interface UserGrowthChartProps {
    dailyStats: DailyStats[];
    isRealData: boolean;
}

const UserGrowthChart: React.FC<UserGrowthChartProps> = ({
    dailyStats,
    isRealData,
}) => {
    // 차트 데이터 포맷팅 (날짜를 MM-DD 형식으로)
    const chartData = dailyStats.map(day => ({
        ...day,
        date: new Date(day.date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })
    }));

    // 테스트용 더미 데이터 (실제 데이터가 없을 때 사용)
    const testData = [
        { date: '12-01', newUsers: 5 },
        { date: '12-02', newUsers: 8 },
        { date: '12-03', newUsers: 3 },
        { date: '12-04', newUsers: 12 },
        { date: '12-05', newUsers: 7 },
        { date: '12-06', newUsers: 9 },
        { date: '12-07', newUsers: 15 }
    ];

    // 실제 데이터가 있으면 실제 데이터 사용, 없으면 더미 데이터 사용
    const displayData = dailyStats.length > 0 && dailyStats.some(day => day.newUsers > 0) ? chartData : testData;

    return (
        <Card
            title={`📈 신규 가입자 트렌드 ${isRealData ? '(실제 데이터)' : '(더미 데이터)'}`}
            bordered={false}
        >
            <Alert
                message={`데이터 상태: dailyStats.length = ${dailyStats.length}, 실제 데이터 사용: ${isRealData ? '예' : '아니오 (더미 데이터 사용)'}`}
                type={isRealData ? "success" : "warning"}
                style={{ marginBottom: 16 }}
                showIcon
            />

            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={displayData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="newUsers"
                        stroke="#1890ff"
                        strokeWidth={3}
                        name="신규 가입자"
                        dot={{ fill: '#1890ff', strokeWidth: 2, r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default UserGrowthChart; 