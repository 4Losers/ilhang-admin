import React from 'react';
import {
    ClockCircleOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';

// 상태별 아이콘 및 색상 설정 함수
export const getStatusConfig = (status: string) => {
    switch (status) {
        case 'RECRUITING':
            return { icon: React.createElement(ClockCircleOutlined), color: 'processing', text: '모집중' };
        case 'IN_PROGRESS':
            return { icon: React.createElement(TeamOutlined), color: 'processing', text: '진행중' };
        case 'COMPLETED':
            return { icon: React.createElement(CheckCircleOutlined), color: 'success', text: '완료' };
        case 'CANCELLED':
            return { icon: React.createElement(CloseCircleOutlined), color: 'error', text: '취소' };
        default:
            return { icon: React.createElement(ExclamationCircleOutlined), color: 'default', text: status };
    }
}; 