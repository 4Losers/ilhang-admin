// ✅ 매칭 서비스 통합 export

// 타입들
export * from './types';

// 상수들
export * from './constants';

// API 함수들
export * from './api';

// 새로운 백엔드 API 함수들
export {
    // 매치 주기 관리
    createMatchCycle,
    getMatchCycles,
    updateMatchCycle,
    toggleMatchCycleActive,

    // 매치 현황
    getMatchOverview,
    getMatchInstances,
    getMatchInstanceDetail,

    // 기존 호환성 함수들
    fetchMatchings,
    fetchMatchOverview,
    fetchInstanceDetailWithGroups
} from './api'; 