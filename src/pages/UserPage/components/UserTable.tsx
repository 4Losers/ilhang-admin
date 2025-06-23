import React from 'react';
import { Button, Space, Avatar } from 'antd';
import { UserOutlined, EyeOutlined, StopOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { User } from '@/types/user';
import dayjs from 'dayjs';
import StatusBadge from '@/components/common/StatusBadge';

interface UserTableProps {
    users: User[];
    loading: boolean;
    onViewDetail: (user: User) => void;
    onBlock: (user: User) => void;
    onUnblock: (user: User) => void;
}

interface Column {
    title: string;
    key: string;
    dataIndex?: keyof User;
    width?: number;
    render?: (value: any, record: User) => React.ReactNode;
}

const UserTable: React.FC<UserTableProps> = ({
    users,
    loading,
    onViewDetail,
    onBlock,
    onUnblock,
}) => {
    const columns: Column[] = [
        {
            title: '프로필',
            key: 'profile',
            width: 80,
            render: (_, user: User) => (
                <Avatar
                    src={user.profileImage}
                    icon={<UserOutlined />}
                    size="large"
                />
            ),
        },
        {
            title: 'ID',
            dataIndex: 'userId',
            key: 'userId',
            width: 80,
        },
        {
            title: '닉네임',
            dataIndex: 'nickname',
            key: 'nickname',
            width: 120,
        },
        {
            title: '이메일',
            dataIndex: 'email',
            key: 'email',
            width: 200,
        },
        {
            title: '가입일',
            dataIndex: 'joinedAt',
            key: 'joinedAt',
            width: 120,
            render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
        },
        {
            title: '마지막 로그인',
            dataIndex: 'lastLoginAt',
            key: 'lastLoginAt',
            width: 120,
            render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
        },
        {
            title: '미션 통계',
            key: 'missionStats',
            width: 120,
            render: (_, user: User) => (
                <span>
                    {user.completedMissions || 0}/{user.totalMissions || 0}
                </span>
            ),
        },
        {
            title: '상태',
            dataIndex: 'status',
            key: 'status',
            width: 100,
            render: (status: string | undefined) => (
                <StatusBadge status={status ?? '알수없음'} />
            ),
        },
        {
            title: '조치',
            key: 'actions',
            width: 150,
            render: (_, user: User) => (
                <Space>
                    <Button
                        size="small"
                        icon={<EyeOutlined />}
                        onClick={() => onViewDetail(user)}
                    >
                        상세
                    </Button>
                    {user.status === '정상' ? (
                        <Button
                            size="small"
                            danger
                            icon={<StopOutlined />}
                            onClick={() => onBlock(user)}
                        >
                            정지
                        </Button>
                    ) : (
                        <Button
                            size="small"
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            onClick={() => onUnblock(user)}
                        >
                            해제
                        </Button>
                    )}
                </Space>
            ),
        },
    ];

    const renderCell = (column: Column, user: User) => {
        if (column.render) {
            const value = column.dataIndex ? user[column.dataIndex] : undefined;
            return column.render(value, user);
        }
        if (column.dataIndex) {
            return user[column.dataIndex];
        }
        return null;
    };

    return (
        <div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#fafafa' }}>
                        {columns.map((column) => (
                            <th
                                key={column.key}
                                style={{
                                    padding: '12px 8px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #f0f0f0',
                                    fontWeight: 600,
                                    fontSize: 14,
                                }}
                            >
                                {column.title}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.userId} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            {columns.map((column) => (
                                <td
                                    key={column.key}
                                    style={{
                                        padding: '12px 8px',
                                        textAlign: 'left',
                                    }}
                                >
                                    {renderCell(column, user)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {loading && (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    데이터를 불러오는 중...
                </div>
            )}

            {!loading && users.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#8c8c8c' }}>
                    사용자 데이터가 없습니다.
                </div>
            )}
        </div>
    );
};

export default UserTable; 