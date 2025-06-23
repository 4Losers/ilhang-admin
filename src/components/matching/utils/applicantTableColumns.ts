import React from 'react';
import { Button, Space, Tag, Avatar } from 'antd';
import {
    CheckOutlined,
    CloseOutlined,
    UserOutlined
} from '@ant-design/icons';
import { MatchApplicant } from '../../../services/matching/types';
import dayjs from 'dayjs';

// 상태별 색상 및 텍스트
const getStatusConfig = (status: string) => {
    const config = {
        'WAITING': { color: 'warning', text: '대기중' },
        'ACCEPTED': { color: 'success', text: '수락완료' },
        'CANCELLED': { color: 'error', text: '취소됨' },
        'REJECTED': { color: 'error', text: '거절됨' }
    };
    return config[status as keyof typeof config] || { color: 'default', text: status };
};

// 신청자 관리 테이블 컬럼 정의
export const getApplicantTableColumns = (
    handleStatusChange: (applicant: MatchApplicant, status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED') => void,
    handleAssignGroup: (applicant: MatchApplicant) => void
) => [
        {
            title: '신청자',
            key: 'applicant',
            render: (_: any, record: MatchApplicant) => React.createElement('div', {
                style: { display: 'flex', alignItems: 'center', gap: '8px' }
            },
                React.createElement(Avatar, {
                    size: 'small',
                    src: record.profileImage,
                    icon: React.createElement(UserOutlined)
                }),
                React.createElement('div', null,
                    React.createElement('div', { style: { fontWeight: 'bold' } }, record.nickname),
                    React.createElement('div', { style: { fontSize: '12px', color: '#666' } }, `ID: ${record.userId}`)
                )
            )
        },
        {
            title: '신청 정보',
            key: 'application',
            render: (_: any, record: MatchApplicant) => React.createElement('div', null,
                React.createElement('div', { style: { fontWeight: 'bold' } }, record.instanceName),
                React.createElement('div', { style: { fontSize: '12px', color: '#666' } }, `미션: ${record.missionName}`),
                React.createElement('div', { style: { fontSize: '12px', color: '#666' } }, `신청일: ${dayjs(record.appliedAt).format('YYYY-MM-DD HH:mm')}`)
            )
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const config = getStatusConfig(status);
                return React.createElement(Tag, { color: config.color }, config.text);
            }
        },
        {
            title: '처리 정보',
            key: 'processing',
            render: (_: any, record: MatchApplicant) => React.createElement('div', null,
                record.acceptedAt && React.createElement('div', {
                    style: { fontSize: '12px', color: '#52c41a' }
                }, `수락: ${dayjs(record.acceptedAt).format('YYYY-MM-DD HH:mm')}`),
                record.cancelledAt && React.createElement('div', {
                    style: { fontSize: '12px', color: '#ff4d4f' }
                }, `취소: ${dayjs(record.cancelledAt).format('YYYY-MM-DD HH:mm')}`)
            )
        },
        {
            title: '작업',
            key: 'actions',
            render: (_: any, record: MatchApplicant) => React.createElement(Space, null,
                record.status === 'WAITING' && React.createElement(React.Fragment, null,
                    React.createElement(Button, {
                        size: 'small',
                        type: 'primary',
                        icon: React.createElement(CheckOutlined),
                        onClick: () => handleStatusChange(record, 'ACCEPTED')
                    }, '수락'),
                    React.createElement(Button, {
                        size: 'small',
                        danger: true,
                        icon: React.createElement(CloseOutlined),
                        onClick: () => handleStatusChange(record, 'REJECTED')
                    }, '거절'),
                    React.createElement(Button, {
                        size: 'small',
                        onClick: () => handleAssignGroup(record)
                    }, '그룹 배정')
                ),
                record.status === 'ACCEPTED' && React.createElement(Button, {
                    size: 'small',
                    danger: true,
                    onClick: () => handleStatusChange(record, 'CANCELLED')
                }, '취소')
            )
        }
    ]; 