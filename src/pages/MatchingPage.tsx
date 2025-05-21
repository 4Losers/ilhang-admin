import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space } from 'antd';
import { fetchMatchings, Matching } from '@/services/matchingService';
import dayjs from 'dayjs';

const MatchingPage = () => {
  const [matchings, setMatchings] = useState<Matching[]>([]);

  useEffect(() => {
    const load = async () => {
      console.log('📣 load 함수 실행됨'); // ✅ 이거 찍히는지 확인
      try {
        const data = await fetchMatchings();
        console.log('✅ 매칭 데이터:', data); // ✅ 이거도 확인
        setMatchings(data);
      } catch (e) {
        console.error('❌ 매칭 불러오기 실패:', e);
      }
    };

    load();
  }, []);

  const handleViewTeams = (id: number) => {
    console.log(`매칭 ${id}의 팀 구성 보기`);
  };

  const statusLabelMap: Record<Matching['status'], string> = {
    RECRUITING: '대기',
    MATCHING: '매칭 중',
    IN_PROGRESS: '진행중',
    COMPLETED: '종료',
    FAILED: '실패',
  };

  const statusColorMap: Record<Matching['status'], string> = {
    RECRUITING: 'orange',
    MATCHING: 'volcano',
    IN_PROGRESS: 'green',
    COMPLETED: 'gray',
    FAILED: 'red',
  };

  const columns = [
    { title: '회차 ID', dataIndex: 'instanceId', key: 'instanceId' },
    { title: '매칭 주기', dataIndex: 'cycleName', key: 'cycleName' },
    {
      title: '시작일',
      dataIndex: 'matchStartTime',
      key: 'matchStartTime',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '종료일',
      dataIndex: 'matchEndTime',
      key: 'matchEndTime',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: Matching['status']) => (
        <Tag color={statusColorMap[status]}>{statusLabelMap[status]}</Tag>
      ),
    },
    {
      title: '조치',
      key: 'actions',
      render: (_: any, record: Matching) => (
        <Space>
          <Button size="small" onClick={() => handleViewTeams(record.instanceId)}>
            팀 구성 보기
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 24 }}>매칭 관리</h1>
      <Table dataSource={matchings} columns={columns} rowKey="instanceId" />
    </div>
  );
};

export default MatchingPage;