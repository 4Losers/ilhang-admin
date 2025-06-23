import { useEffect, useState } from 'react';
import { message } from 'antd';
import { fetchUsers, updateUserStatus, fetchUserDetail } from '@/services/userService';
import { User, UserSearchParams } from '@/types/user';
import PageLayout from '@/components/Layout/PageLayout';
import PageHeader from '@/components/common/PageHeader';
import SearchFilter from '@/components/common/SearchFilter';
import UserTable from './components/UserTable';
import UserDetailModal from './components/UserDetailModal';

const UserPage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });
    const [searchParams, setSearchParams] = useState<UserSearchParams>({});
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [detailLoading, setDetailLoading] = useState(false);

    const loadUsers = async (page = 1, size = 10, params?: UserSearchParams) => {
        try {
            setLoading(true);
            const data = await fetchUsers(page, size, params);
            setUsers(data.list);
            setPagination({
                current: data.pageNum,
                pageSize: data.pageSize,
                total: data.total,
            });
        } catch (err) {
            console.error('유저 불러오기 실패:', err);
            message.error('사용자 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleSearch = (values: UserSearchParams) => {
        setSearchParams(values);
        loadUsers(1, pagination.pageSize, values);
    };

    const handleReset = () => {
        setSearchParams({});
        loadUsers(1, pagination.pageSize);
    };

    const handlePageChange = (page: number, pageSize?: number) => {
        loadUsers(page, pageSize || pagination.pageSize, searchParams);
    };

    const handleBlock = async (user: User) => {
        try {
            await updateUserStatus({
                userId: user.userId,
                action: 'block',
                reason: '관리자에 의한 정지',
            });
            message.success('사용자가 정지되었습니다.');
            loadUsers(pagination.current, pagination.pageSize, searchParams);
        } catch (error) {
            message.error('사용자 정지에 실패했습니다.');
        }
    };

    const handleUnblock = async (user: User) => {
        try {
            await updateUserStatus({
                userId: user.userId,
                action: 'unblock',
            });
            message.success('사용자 정지가 해제되었습니다.');
            loadUsers(pagination.current, pagination.pageSize, searchParams);
        } catch (error) {
            message.error('사용자 정지 해제에 실패했습니다.');
        }
    };

    const handleViewDetail = async (user: User) => {
        setSelectedUser(user);
        setDetailModalVisible(true);
        setDetailLoading(true);

        try {
            const detail = await fetchUserDetail(user.userId);
            setSelectedUser(detail);
        } catch (error) {
            message.error('사용자 상세 정보를 불러오는데 실패했습니다.');
        } finally {
            setDetailLoading(false);
        }
    };

    const searchFilters = [
        {
            name: 'keyword',
            label: '검색',
            type: 'input' as const,
            placeholder: '닉네임 또는 이메일',
        },
        {
            name: 'status',
            label: '상태',
            type: 'select' as const,
            options: [
                { value: '정상', label: '정상' },
                { value: '정지됨', label: '정지됨' },
                { value: '휴면', label: '휴면' },
            ],
        },
        {
            name: 'dateRange',
            label: '가입일',
            type: 'dateRange' as const,
        },
    ];

    return (
        <PageLayout>
            <PageHeader
                title="👥 사용자 관리"
                subtitle="전체 사용자 목록을 확인하고 관리하세요"
            />

            {/* 검색 필터 */}
            <SearchFilter
                filters={searchFilters}
                onSearch={handleSearch}
                onReset={handleReset}
                loading={loading}
            />

            {/* 사용자 테이블 */}
            <UserTable
                users={users}
                loading={loading}
                onViewDetail={handleViewDetail}
                onBlock={handleBlock}
                onUnblock={handleUnblock}
            />

            {/* 페이지네이션 */}
            {pagination.total > 0 && (
                <div style={{
                    marginTop: 24,
                    display: 'flex',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8
                    }}>
                        <span>총 {pagination.total}명</span>
                        <div style={{ display: 'flex', gap: 4 }}>
                            {Array.from({ length: Math.ceil(pagination.total / pagination.pageSize) }, (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => handlePageChange(i + 1)}
                                    style={{
                                        padding: '8px 12px',
                                        border: pagination.current === i + 1 ? '1px solid #1890ff' : '1px solid #d9d9d9',
                                        backgroundColor: pagination.current === i + 1 ? '#1890ff' : '#fff',
                                        color: pagination.current === i + 1 ? '#fff' : '#000',
                                        cursor: 'pointer',
                                        borderRadius: 4,
                                    }}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 사용자 상세 모달 */}
            <UserDetailModal
                user={selectedUser}
                visible={detailModalVisible}
                loading={detailLoading}
                onClose={() => setDetailModalVisible(false)}
            />
        </PageLayout>
    );
};

export default UserPage; 