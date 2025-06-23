import React from 'react';
import { Button, Space, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { CycleConfigResponse } from '../../../services/matching/types';

// 상태별 색상 설정 함수
const getStatusConfig = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return { color: 'success', text: '활성' };
        case 'INACTIVE':
            return { color: 'default', text: '비활성' };
        default:
            return { color: 'default', text: status };
    }
};

// 주기 타입 매핑
const getCycleTypeText = (type: string) => {
    const typeMap: Record<string, string> = {
        'DAILY': '일간',
        'WEEKLY': '주간',
        'MONTHLY': '월간'
    };
    return typeMap[type] || type;
};

// 주기 관리 테이블 컬럼 정의
export const getCycleTableColumns = (
    handleEditCycle: (cycle: CycleConfigResponse) => void,
    handleToggleCycleStatus: (cycle: CycleConfigResponse) => void
) => [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
        },
        {
            title: '주기명',
            dataIndex: 'name',
            key: 'name',
            width: 150,
        },
        {
            title: '주기 타입',
            dataIndex: 'cycleType',
            key: 'cycleType',
            width: 100,
            render: (type: string) => getCycleTypeText(type),
        },
        {
            title: '시작 시간',
            dataIndex: 'startTime',
            key: 'startTime',
            width: 100,
        },
        {
            title: '도전 금액',
            dataIndex: 'challengeAmount',
            key: 'challengeAmount',
            width: 120,
            render: (amount: number) => `${amount.toLocaleString()}원`,
        },
        {
            title: '최대 참가자',
            dataIndex: 'maxParticipants',
            key: 'maxParticipants',
            width: 120,
        },
        {
            title: '최소 참가자',
            dataIndex: 'minParticipants',
            key: 'minParticipants',
            width: 120,
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string) => {
                const config = getStatusConfig(status);
                return React.createElement(Tag, { color: config.color }, config.text);
            },
        },
        {
            title: '생성일',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 150,
            render: (date: string) => new Date(date).toLocaleDateString('ko-KR'),
        },
        {
            title: '작업',
            key: 'action',
            width: 200,
            render: (_: any, record: CycleConfigResponse) => React.createElement(Space, null,
                React.createElement(Button, {
                    type: 'link',
                    icon: React.createElement(EditOutlined),
                    onClick: () => handleEditCycle(record),
                    size: 'small'
                }, '수정'),
                React.createElement(Button, {
                    type: 'link',
                    onClick: () => handleToggleCycleStatus(record),
                    size: 'small'
                }, record.status === 'ACTIVE' ? '비활성화' : '활성화')
            ),
        },
    ]; 