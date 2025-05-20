import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Spin, Pagination } from 'antd'; // ✅ 수정함: Pagination 추가
import { fetchUsers, User } from '@/services/userService';

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const [pageNum, setPageNum] = useState(1); // ✅ 추가함
  const [pageSize, setPageSize] = useState(10); // ✅ 추가함
  const [total, setTotal] = useState(0); // ✅ 추가함

  const loadUsers = async (page = 1, size = 10) => { // ✅ 수정함: 페이지 파라미터 받게 수정
    try {
      setLoading(true); // ✅ 추가함: 페이지 바뀔 때 로딩 다시 true
      const data = await fetchUsers(page, size);
      console.log('✅ 전체 페이지 정보:', {
        pageNum: data.pageNum,
        pageSize: data.pageSize,
        total: data.total,
        pages: data.pages,
      });
      setUsers(data.list);
      setPageNum(data.pageNum); // ✅ 추가함
      setPageSize(data.pageSize); // ✅ 추가함
      setTotal(data.total); // ✅ 추가함
    } catch (err) {
      console.error('유저 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(); // ✅ 수정함: 기본 1페이지 로드
  }, []);

  const handleBlock = (id: number) => {
    console.log(`유저 ${id} 정지 처리`);
  };

  const handleUnblock = (id: number) => {
    console.log(`유저 ${id} 정지 해제`);
  };

  const handleView = (id: number) => {
    console.log(`유저 ${id} 상세 보기`);
  };

  const columns = [
    { title: 'ID', dataIndex: 'userId', key: 'userId' },
    { title: '닉네임', dataIndex: 'nickname', key: 'nickname' },
    { title: '이메일', dataIndex: 'email', key: 'email' },
    { title: '가입일', dataIndex: 'createdAt', key: 'createdAt' },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === '정상' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: '조치',
      key: 'actions',
      render: (_: any, record: User) => (
        <Space>
          <Button size="small" onClick={() => handleView(record.userId)}>상세</Button>
          {record.status === '정상' ? (
            <Button danger size="small" onClick={() => handleBlock(record.userId)}>정지</Button>
          ) : (
            <Button type="primary" size="small" onClick={() => handleUnblock(record.userId)}>해제</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>유저 관리</h1>
      {loading ? (
        <Spin />
      ) : (
        <>
          <Table
            dataSource={users}
            columns={columns}
            rowKey="userId"
            pagination={false} // ✅ 수정함: Table의 기본 페이지네이션 제거
          />
          <Pagination // ✅ 추가함
            current={pageNum}
            pageSize={pageSize}
            total={total}
            onChange={(page) => loadUsers(page, pageSize)}
            style={{ marginTop: 24, textAlign: 'center' }}
          />
        </>
      )}
    </div>
  );
};

export default UserPage;