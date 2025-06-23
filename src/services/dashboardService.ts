import { fetchUsers } from './userService';
import { fetchMissions } from './missionService';

// 대시보드 통계 타입
export interface DashboardStats {
    totalUsers: number;
    totalMissions: number;
}

// 날짜별 통계 타입
export interface DailyStats {
    date: string;
    newUsers: number;
    newMissions: number;
}

// 대시보드 통계 조회 - 총 유저수와 총 미션템플릿수만
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
    try {
        // 1. 총 사용자 수 조회
        const usersResponse = await fetchUsers(1, 1);
        const totalUsers = usersResponse.total;

        // 2. 총 미션 템플릿 수 조회
        const missions = await fetchMissions();
        const totalMissions = missions.length;

        return {
            totalUsers,
            totalMissions
        };
    } catch (error) {
        console.error('대시보드 통계 조회 실패:', error);
        throw error;
    }
};

// 최근 7일간 날짜별 통계 조회
export const fetchDailyStats = async (days: number = 7): Promise<DailyStats[]> => {
    try {
        // 1. 전체 사용자 조회
        const allUsersResponse = await fetchUsers(1, 999);
        const users = allUsersResponse.list;

        // 2. 전체 미션 조회
        const missions = await fetchMissions();

        console.log('전체 사용자 수:', users.length);
        console.log('전체 미션 수:', missions.length);

        // 사용자 가입일 샘플 확인
        if (users.length > 0) {
            console.log('첫 번째 사용자 가입일:', users[0].joinedAt);
        }

        // 3. 최근 7일 날짜 배열 생성
        const dates = [];
        for (let i = days - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            dates.push(date.toISOString().split('T')[0]); // YYYY-MM-DD 형식
        }

        console.log('생성된 날짜 배열:', dates);

        // 4. 날짜별 통계 계산
        const dailyStats: DailyStats[] = dates.map(date => {
            // 해당 날짜에 가입한 사용자 수 (더 유연한 매칭)
            const newUsers = users.filter(user => {
                if (!user.joinedAt) return false;

                // 다양한 날짜 형식 처리
                const userDate = user.joinedAt.split('T')[0]; // ISO 형식에서 날짜만 추출
                return userDate === date;
            }).length;

            // 해당 날짜에 생성된 미션 수 (더 유연한 매칭)
            const newMissions = missions.filter(mission => {
                if (!mission.createdTime) return false;

                // 다양한 날짜 형식 처리
                const missionDate = mission.createdTime.split('T')[0]; // ISO 형식에서 날짜만 추출
                return missionDate === date;
            }).length;

            console.log(`날짜 ${date}: 사용자 ${newUsers}명, 미션 ${newMissions}개`);

            return {
                date,
                newUsers,
                newMissions
            };
        });

        console.log('최종 dailyStats:', dailyStats);
        return dailyStats;
    } catch (error) {
        console.error('날짜별 통계 조회 실패:', error);
        throw error;
    }
}; 