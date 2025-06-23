import React from 'react';
import { Button, Space, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { MatchInstanceOverviewResponse } from '../../../services/matching/types';
import { MissionTemplateView } from '../../../services/missionService';
import { getStatusConfig } from './matchStatusUtils';

// 테이블 컬럼 정의 함수
export const getMatchStatusTableColumns = (
    instanceMissions: Map<number, MissionTemplateView[]>,
    instanceGroupCounts: Map<number, number>,
    handleViewDetail: (instanceId: number) => void
) => [
        {
            title: '인스턴스 ID',
            dataIndex: 'instanceId',
            key: 'instanceId',
            width: 100,
        },
        {
            title: '주기명',
            dataIndex: 'cycleName',
            key: 'cycleName',
            width: 150,
        },
        {
            title: '미션',
            key: 'missions',
            width: 250,
            render: (_: any, record: MatchInstanceOverviewResponse) => {
                const missionsForInstance = instanceMissions.get(record.instanceId) || [];

                if (missionsForInstance.length === 0) {
                    return React.createElement('span', { style: { color: '#999' } }, '미션 정보 없음');
                }

                if (missionsForInstance.length === 1) {
                    return React.createElement(Tag, { color: 'blue' }, missionsForInstance[0].title);
                }

                return React.createElement('div', null,
                    React.createElement(Tag, { color: 'blue' }, missionsForInstance[0].title),
                    missionsForInstance.length > 1 && React.createElement(Tag, { color: 'green' }, `외 ${missionsForInstance.length - 1}개`)
                );
            },
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            render: (status: string) => {
                const config = getStatusConfig(status);
                return React.createElement(Tag, { color: config.color, icon: config.icon }, config.text);
            },
        },
        {
            title: '그룹 수',
            key: 'groupCount',
            width: 100,
            render: (_: any, record: MatchInstanceOverviewResponse) => {
                const actualGroupCount = instanceGroupCounts.get(record.instanceId) ?? 0;
                return React.createElement('span', {
                    style: {
                        color: actualGroupCount === 0 ? '#999' : '#000',
                        fontWeight: actualGroupCount > 0 ? 'bold' : 'normal'
                    }
                }, actualGroupCount);
            },
        },
        {
            title: '작업',
            key: 'action',
            width: 120,
            render: (_: any, record: MatchInstanceOverviewResponse) => React.createElement(Space, null,
                React.createElement(Button, {
                    type: 'link',
                    icon: React.createElement(EyeOutlined),
                    onClick: () => handleViewDetail(record.instanceId),
                    size: 'small'
                }, '상세')
            ),
        },
    ];

// 그룹 테이블 컬럼 정의
export const getGroupTableColumns = () => [
    {
        title: '그룹 ID',
        dataIndex: 'matchGroupId',
        key: 'matchGroupId',
        width: 80,
    },
    {
        title: '미션 ID',
        dataIndex: 'missionId',
        key: 'missionId',
        width: 80,
    },
    {
        title: '매치 크기',
        dataIndex: 'matchSize',
        key: 'matchSize',
        width: 100,
    },
    {
        title: '팀 수',
        dataIndex: 'teamCount',
        key: 'teamCount',
        width: 80,
    },
    {
        title: '참가자 수',
        dataIndex: 'participantCount',
        key: 'participantCount',
        width: 100,
    },
    {
        title: '도전 포인트',
        dataIndex: 'challengePoint',
        key: 'challengePoint',
        width: 120,
    },
    {
        title: '생명력',
        dataIndex: 'lifePoint',
        key: 'lifePoint',
        width: 80,
    },
    {
        title: '상태',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status: string) => {
            const config = getStatusConfig(status);
            return React.createElement(Tag, { color: config.color, icon: config.icon }, config.text);
        },
    },
]; 