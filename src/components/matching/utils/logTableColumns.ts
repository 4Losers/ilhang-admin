import React from 'react';
import { Button, Tag, Avatar } from 'antd';
import {
    EyeOutlined,
    UserOutlined
} from '@ant-design/icons';
import { MatchingLog } from '../../../services/matching/types';
import dayjs from 'dayjs';

// 액션별 색상 및 텍스트
const getActionConfig = (action: string) => {
    const config = {
        'GROUP_CANCEL': { color: 'red', text: '그룹 취소', icon: '🚫' },
        'TEAM_CANCEL': { color: 'orange', text: '팀 취소', icon: '⚠️' },
        'USER_DROP': { color: 'red', text: '사용자 탈락', icon: '👤' },
        'MANUAL_MATCH': { color: 'blue', text: '수동 매칭', icon: '⚙️' },
        'SETTING_CHANGE': { color: 'purple', text: '설정 변경', icon: '🔧' }
    };
    return config[action as keyof typeof config] || { color: 'default', text: action, icon: '❓' };
};

const getTargetTypeConfig = (targetType: string) => {
    const config = {
        'GROUP': { color: 'blue', text: '그룹' },
        'TEAM': { color: 'green', text: '팀' },
        'USER': { color: 'orange', text: '사용자' },
        'INSTANCE': { color: 'purple', text: '회차' },
        'CYCLE': { color: 'cyan', text: '주기' }
    };
    return config[targetType as keyof typeof config] || { color: 'default', text: targetType };
};

// 매칭 로그 테이블 컬럼 정의
export const getLogTableColumns = (
    handleViewDetail: (log: MatchingLog) => void
) => [
        {
            title: '시간',
            dataIndex: 'timestamp',
            key: 'timestamp',
            render: (timestamp: string) => dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss'),
            width: 150
        },
        {
            title: '관리자',
            key: 'admin',
            render: (_: any, record: MatchingLog) => React.createElement('div', {
                style: { display: 'flex', alignItems: 'center', gap: '8px' }
            },
                React.createElement(Avatar, {
                    size: 'small',
                    icon: React.createElement(UserOutlined)
                }),
                React.createElement('span', null, record.adminName)
            ),
            width: 120
        },
        {
            title: '액션',
            dataIndex: 'action',
            key: 'action',
            render: (action: string) => {
                const config = getActionConfig(action);
                return React.createElement(Tag, { color: config.color },
                    `${config.icon} ${config.text}`
                );
            },
            width: 120
        },
        {
            title: '대상',
            key: 'target',
            render: (_: any, record: MatchingLog) => React.createElement('div', null,
                React.createElement('div', {
                    style: { display: 'flex', alignItems: 'center', gap: '4px' }
                },
                    React.createElement(Tag, {
                        color: getTargetTypeConfig(record.targetType).color
                    }, getTargetTypeConfig(record.targetType).text),
                    React.createElement('span', {
                        style: { fontWeight: 'bold' }
                    }, record.targetName)
                ),
                React.createElement('div', {
                    style: { fontSize: '12px', color: '#666' }
                }, `ID: ${record.targetId}`)
            ),
            width: 200
        },
        {
            title: '설명',
            dataIndex: 'description',
            key: 'description',
            render: (description: string) => React.createElement('div', {
                style: {
                    maxWidth: 300,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                }
            }, description)
        },
        {
            title: '작업',
            key: 'actions',
            render: (_: any, record: MatchingLog) => React.createElement(Button, {
                size: 'small',
                icon: React.createElement(EyeOutlined),
                onClick: () => handleViewDetail(record)
            }, '상세'),
            width: 80
        }
    ]; 