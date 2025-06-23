import { useEffect, useState } from 'react';
import { Spin, message } from 'antd';
import { fetchDashboardStats, fetchDailyStats, DashboardStats, DailyStats } from '@/services/dashboardService';
import PageLayout from '@/components/Layout/PageLayout';
import PageHeader from '@/components/common/PageHeader';
import StatsOverview from './components/StatsOverview';
import UserGrowthChart from './components/UserGrowthChart';
import MissionStatsChart from './components/MissionStatsChart';

const DashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // 기본 통계 먼저 로드
            const statsData = await fetchDashboardStats();
            setStats(statsData);

            // 날짜별 통계 로드
            try {
                const dailyStatsData = await fetchDailyStats(7);
                console.log('날짜별 통계 데이터:', dailyStatsData);
                setDailyStats(dailyStatsData);
            } catch (dailyError) {
                console.error('날짜별 통계 로드 실패:', dailyError);
                setDailyStats([]);
            }

        } catch (error) {
            console.error('대시보드 데이터 로드 실패:', error);
            message.error('대시보드 데이터를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadDashboardData();
        setRefreshing(false);
        message.success('데이터가 새로고침되었습니다.');
    };

    useEffect(() => {
        loadDashboardData();
    }, []);

    // 오늘 신규 가입자 수
    const todayNewUsers = dailyStats.length > 0 ? dailyStats[dailyStats.length - 1].newUsers : 0;

    // 최근 7일 총 신규 가입자 수
    const weeklyTotalUsers = dailyStats.reduce((sum, day) => sum + day.newUsers, 0);

    // 실제 데이터 사용 여부
    const isRealData = dailyStats.length > 0 && dailyStats.some(day => day.newUsers > 0);

    if (loading) {
        return (
            <PageLayout>
                <div style={{ textAlign: 'center', padding: '100px' }}>
                    <Spin size="large" />
                    <div style={{ marginTop: 16 }}>대시보드 데이터를 불러오는 중...</div>
                </div>
            </PageLayout>
        );
    }

    return (
        <PageLayout>
            <PageHeader
                title="🎯 일행 관리자 대시보드"
                subtitle="서비스 현황과 주요 지표를 한눈에 확인하세요"
                onRefresh={handleRefresh}
                refreshLoading={refreshing}
            />

            {/* 통계 개요 */}
            <StatsOverview
                stats={stats}
                todayNewUsers={todayNewUsers}
                weeklyTotalUsers={weeklyTotalUsers}
                loading={refreshing}
            />

            {/* 사용자 성장 차트 */}
            <UserGrowthChart
                dailyStats={dailyStats}
                isRealData={isRealData}
            />

            {/* 미션 통계 차트 */}
            <MissionStatsChart
                stats={stats}
                weeklyTotalUsers={weeklyTotalUsers}
            />
        </PageLayout>
    );
};

export default DashboardPage; 