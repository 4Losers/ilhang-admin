// ✅ 매칭 관련 상수 정의

// 매칭 관리 관련 상수들

// API 엔드포인트
export const MATCHING_API_ENDPOINTS = {
    // 매치 현황
    CYCLES: '/api/admin/matching/cycles',
    INSTANCES: '/api/admin/matching/instances',
    GROUPS: '/api/admin/matching/groups',

    // 매치 회차 관리
    CYCLE_CONFIGS: '/api/admin/matching/cycle-configs',
    INSTANCE_CONFIGS: '/api/admin/matching/instance-configs',

    // 신청자 관리
    APPLICANTS: '/api/admin/matching/applicants',

    // 매칭 로그
    LOGS: '/api/admin/matching/logs',

    // 설정
    SETTINGS: '/api/admin/matching/settings',

    // 수동 조치
    MANUAL_ACTIONS: {
        GROUP_CANCEL: '/api/admin/matching/groups',
        TEAM_CANCEL: '/api/admin/matching/teams',
        USER_DROP: '/api/admin/matching/participants',
        MANUAL_MATCH: '/api/admin/matching/instances'
    }
};

// 기본 페이지네이션 설정
export const DEFAULT_PAGINATION = {
    PAGE: 1,
    SIZE: 10,
    MAX_SIZE: 100
};

// 매칭 상태
export const MATCHING_STATUS = {
    // 주기 상태
    CYCLE: {
        ACTIVE: 'ACTIVE',
        INACTIVE: 'INACTIVE'
    },

    // 회차 상태
    INSTANCE: {
        WAITING: 'WAITING',
        IN_PROGRESS: 'IN_PROGRESS',
        COMPLETED: 'COMPLETED',
        CANCELLED: 'CANCELLED'
    },

    // 그룹 상태
    GROUP: {
        CREATED: 'CREATED',
        MATCHING: 'MATCHING',
        MATCHED: 'MATCHED',
        CANCELLED: 'CANCELLED'
    },

    // 팀 상태
    TEAM: {
        ACTIVE: 'ACTIVE',
        CANCELLED: 'CANCELLED',
        COMPLETED: 'COMPLETED'
    },

    // 참가자 상태
    PARTICIPANT: {
        ACTIVE: 'ACTIVE',
        DROPPED: 'DROPPED',
        COMPLETED: 'COMPLETED'
    },

    // 신청자 상태
    APPLICANT: {
        WAITING: 'WAITING',
        ACCEPTED: 'ACCEPTED',
        CANCELLED: 'CANCELLED',
        REJECTED: 'REJECTED'
    }
};

// 주기 타입
export const CYCLE_TYPES = {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY'
};

// 매칭 전략
export const MATCHING_STRATEGIES = {
    SUCCESS_RATE: 'SUCCESS_RATE',
    RANDOM: 'RANDOM',
    LEVEL_BASED: 'LEVEL_BASED',
    TIME_BASED: 'TIME_BASED'
};

// 액션 타입
export const ACTION_TYPES = {
    GROUP_CANCEL: 'GROUP_CANCEL',
    TEAM_CANCEL: 'TEAM_CANCEL',
    USER_DROP: 'USER_DROP',
    MANUAL_MATCH: 'MANUAL_MATCH',
    SETTING_CHANGE: 'SETTING_CHANGE'
};

// 대상 타입
export const TARGET_TYPES = {
    GROUP: 'GROUP',
    TEAM: 'TEAM',
    USER: 'USER',
    INSTANCE: 'INSTANCE',
    CYCLE: 'CYCLE'
};

// 상태별 색상 매핑
export const STATUS_COLORS = {
    // 성공/활성 상태
    SUCCESS: '#52c41a',
    ACTIVE: '#52c41a',
    COMPLETED: '#52c41a',
    ACCEPTED: '#52c41a',

    // 진행중 상태
    PROCESSING: '#1890ff',
    IN_PROGRESS: '#1890ff',
    MATCHING: '#1890ff',

    // 경고 상태
    WARNING: '#faad14',
    WAITING: '#faad14',
    CREATED: '#faad14',

    // 에러/취소 상태
    ERROR: '#ff4d4f',
    CANCELLED: '#ff4d4f',
    DROPPED: '#ff4d4f',
    REJECTED: '#ff4d4f',

    // 기본 상태
    DEFAULT: '#d9d9d9',
    INACTIVE: '#d9d9d9'
};

// 상태별 텍스트 매핑
export const STATUS_TEXTS = {
    // 주기 상태
    ACTIVE: '활성',
    INACTIVE: '비활성',

    // 회차 상태
    WAITING: '대기',
    IN_PROGRESS: '진행중',
    COMPLETED: '완료',
    CANCELLED: '취소',

    // 그룹 상태
    CREATED: '생성됨',
    MATCHING: '매칭중',
    MATCHED: '매칭완료',

    // 팀 상태
    ACTIVE: '활성',
    CANCELLED: '취소',
    COMPLETED: '완료',

    // 참가자 상태
    DROPPED: '탈락',

    // 신청자 상태
    ACCEPTED: '수락완료',
    REJECTED: '거절됨'
};

// 주기 타입별 텍스트
export const CYCLE_TYPE_TEXTS = {
    DAILY: '일간',
    WEEKLY: '주간',
    MONTHLY: '월간'
};

// 매칭 전략별 텍스트
export const MATCHING_STRATEGY_TEXTS = {
    SUCCESS_RATE: '성공률 기반 매칭',
    RANDOM: '랜덤 매칭',
    LEVEL_BASED: '레벨 기반 매칭',
    TIME_BASED: '시간대 기반 매칭'
};

// 액션별 텍스트
export const ACTION_TEXTS = {
    GROUP_CANCEL: '그룹 취소',
    TEAM_CANCEL: '팀 취소',
    USER_DROP: '사용자 탈락',
    MANUAL_MATCH: '수동 매칭',
    SETTING_CHANGE: '설정 변경'
};

// 대상 타입별 텍스트
export const TARGET_TYPE_TEXTS = {
    GROUP: '그룹',
    TEAM: '팀',
    USER: '사용자',
    INSTANCE: '회차',
    CYCLE: '주기'
}; 