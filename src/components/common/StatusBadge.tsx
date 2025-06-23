import React from 'react';
import { Tag } from 'antd';

type StatusType =
    | 'active' | 'inactive' | 'pending' | 'completed' | 'rejected'
    | 'blocked' | 'normal' | 'dormant' | 'processing' | 'success' | 'error';

interface StatusBadgeProps {
    status?: string;
    type?: StatusType;
    size?: 'small' | 'default' | 'large';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    type,
    size = 'default',
}) => {
    // 상태별 색상 매핑
    const getStatusColor = (statusText?: string, statusType?: StatusType): string => {
        if (!statusText) return 'default';
        if (statusType) {
            const colorMap: Record<StatusType, string> = {
                active: 'green',
                inactive: 'red',
                pending: 'orange',
                completed: 'blue',
                rejected: 'red',
                blocked: 'red',
                normal: 'green',
                dormant: 'orange',
                processing: 'blue',
                success: 'green',
                error: 'red',
            };
            return colorMap[statusType];
        }

        // 텍스트 기반 색상 매핑
        const text = statusText.toLowerCase();
        if (text.includes('정상') || text.includes('활성') || text.includes('승인') || text.includes('완료')) {
            return 'green';
        }
        if (text.includes('정지') || text.includes('차단') || text.includes('반려') || text.includes('오류')) {
            return 'red';
        }
        if (text.includes('대기') || text.includes('처리') || text.includes('휴면')) {
            return 'orange';
        }
        if (text.includes('진행')) {
            return 'blue';
        }

        return 'default';
    };

    const fontSize = size === 'small' ? 12 : size === 'large' ? 16 : 14;
    const padding = size === 'small' ? '2px 8px' : size === 'large' ? '6px 12px' : '4px 10px';

    return (
        <Tag
            color={getStatusColor(status, type)}
            style={{
                fontSize,
                padding,
                borderRadius: 6,
                fontWeight: 500,
                border: 'none',
                textAlign: 'center',
                minWidth: size === 'small' ? 60 : 80,
            }}
        >
            {status ?? '알수없음'}
        </Tag>
    );
};

export default StatusBadge; 