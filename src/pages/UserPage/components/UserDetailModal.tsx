import React from 'react';
import { Modal, Descriptions, Avatar, Tag, Space } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { User } from '@/types/user';
import dayjs from 'dayjs';
import StatusBadge from '@/components/common/StatusBadge';

interface UserDetailModalProps {
    user: User | null;
    visible: boolean;
    loading: boolean;
    onClose: () => void;
}

const UserDetailModal: React.FC<UserDetailModalProps> = ({
    user,
    visible,
    loading,
    onClose,
}) => {
    if (!user) return null;

    return (
        <Modal
            title="사용자 상세 정보"
            open={visible}
            onCancel={onClose}
            footer={null}
            width={600}
            confirmLoading={loading}
        >
            <div style={{ padding: '16px 0' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 24,
                    padding: '16px',
                    backgroundColor: '#fafafa',
                    borderRadius: 8
                }}>
                    <Avatar
                        src={user.profileImage}
                        icon={<UserOutlined />}
                        size={64}
                        style={{ marginRight: 16 }}
                    />
                    <div>
                        <h3 style={{ margin: 0, marginBottom: 4 }}>{user.nickname}</h3>
                        <p style={{ margin: 0, color: '#8c8c8c' }}>{user.email}</p>
                        <StatusBadge status={user.status} />
                    </div>
                </div>

                <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="사용자 ID" span={2}>
                        {user.userId}
                    </Descriptions.Item>

                    <Descriptions.Item label="닉네임">
                        {user.nickname}
                    </Descriptions.Item>

                    <Descriptions.Item label="이메일">
                        {user.email}
                    </Descriptions.Item>

                    <Descriptions.Item label="가입일">
                        {dayjs(user.joinedAt).format('YYYY-MM-DD HH:mm')}
                    </Descriptions.Item>

                    <Descriptions.Item label="마지막 로그인">
                        {user.lastLoginAt ? dayjs(user.lastLoginAt).format('YYYY-MM-DD HH:mm') : '로그인 기록 없음'}
                    </Descriptions.Item>

                    <Descriptions.Item label="미션 완료율" span={2}>
                        <Space>
                            <span>{user.completedMissions || 0} / {user.totalMissions || 0}</span>
                            {user.totalMissions && user.totalMissions > 0 && (
                                <Tag color="blue">
                                    {Math.round(((user.completedMissions || 0) / user.totalMissions) * 100)}%
                                </Tag>
                            )}
                        </Space>
                    </Descriptions.Item>

                    <Descriptions.Item label="상태" span={2}>
                        <StatusBadge status={user.status} />
                    </Descriptions.Item>
                </Descriptions>
            </div>
        </Modal>
    );
};

export default UserDetailModal; 