import { useEffect, useState } from 'react';
import { Table, Tag, Button, Space, Switch, message, Popconfirm, Modal } from 'antd';
import {
  fetchMatchings,
  toggleMatchingActive,
  deleteMatching,
  Matching,
  MatchingInstance,
  fetchMatchingInstances,
  fetchMatchingTeams,
  createMatching,
  updateMatching,
  CreateMatchingRequest,
} from '../services/matchingService';
import dayjs from 'dayjs';
import MatchingForm from '../components/MatchingForm';

const MatchingPage = () => {
  const [matchings, setMatchings] = useState<Matching[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedCycleId, setSelectedCycleId] = useState<number | null>(null);
  const [instancesModalVisible, setInstancesModalVisible] = useState(false);
  const [teamsModalVisible, setTeamsModalVisible] = useState(false);
  const [instances, setInstances] = useState<MatchingInstance[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMatching, setEditingMatching] = useState<Matching | null>(null);

  const loadMatchings = async (page = 1, pageSize = 10) => {
    setLoading(true);
    try {
      console.log('🔍 매칭 목록 요청 시작:', { page, pageSize });
      const response = await fetchMatchings({
        page: page - 1, // 백엔드는 0부터 시작
        size: pageSize,
        sort: 'createdAt,desc'
      });

      console.log('📊 매칭 목록 응답:', response);
      console.log('📊 매칭 데이터:', response.content);
      console.log('📊 총 개수:', response.totalElements);

      setMatchings(response.content);
      setPagination({
        current: page,
        pageSize,
        total: response.totalElements,
      });
    } catch (error) {
      console.error('❌ 매칭 목록 로드 실패:', error);
      console.error('❌ 에러 상세:', (error as any).response?.data);
      message.error('매칭 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatchings();
  }, []);

  const handleToggleActive = async (cycleId: number, active: boolean) => {
    try {
      await toggleMatchingActive(cycleId);
      message.success(`매칭 주기가 ${active ? '활성화' : '비활성화'}되었습니다.`);
      // 목록 새로고침
      loadMatchings(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('❌ 활성화 상태 변경 실패:', error);
      message.error('활성화 상태 변경에 실패했습니다.');
    }
  };

  const handleDelete = async (cycleId: number) => {
    try {
      await deleteMatching(cycleId);
      message.success('매칭 주기가 삭제되었습니다.');
      loadMatchings(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('❌ 매칭 주기 삭제 실패:', error);
      message.error('매칭 주기 삭제에 실패했습니다.');
    }
  };

  const handleCreate = () => {
    setEditingMatching(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: Matching) => {
    setEditingMatching(record);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingMatching(null);
  };

  const handleFinish = async (values: CreateMatchingRequest) => {
    setLoading(true);
    try {
      if (editingMatching) {
        await updateMatching(editingMatching.cycleId, values);
        message.success('매칭 주기가 성공적으로 수정되었습니다.');
      } else {
        await createMatching(values);
        message.success('매칭 주기가 성공적으로 생성되었습니다.');
      }
      setIsModalOpen(false);
      loadMatchings(pagination.current, pagination.pageSize);
    } catch (error) {
      console.error('❌ 매칭 주기 저장 실패:', error);
      message.error('매칭 주기 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleViewInstances = async (cycleId: number) => {
    setSelectedCycleId(cycleId);
    setInstancesModalVisible(true);
    try {
      const response = await fetchMatchingInstances(cycleId);
      setInstances(response.content);
    } catch (error) {
      console.error('❌ 인스턴스 목록 로드 실패:', error);
      message.error('인스턴스 목록을 불러오는데 실패했습니다.');
    }
  };

  const handleViewTeams = async (cycleId: number) => {
    setSelectedCycleId(cycleId);
    setTeamsModalVisible(true);
    try {
      const response = await fetchMatchingTeams(cycleId);
      setTeams(response.content);
    } catch (error) {
      console.error('❌ 팀 구성 로드 실패:', error);
      message.error('팀 구성을 불러오는데 실패했습니다.');
    }
  };

  const statusLabelMap: Record<MatchingInstance['status'], string> = {
    RECRUITING: '모집중',
    MATCHING: '매칭중',
    IN_PROGRESS: '진행중',
    COMPLETED: '완료',
    FAILED: '실패',
  };

  const statusColorMap: Record<MatchingInstance['status'], string> = {
    RECRUITING: 'blue',
    MATCHING: 'orange',
    IN_PROGRESS: 'green',
    COMPLETED: 'gray',
    FAILED: 'red',
  };

  const columns = [
    {
      title: '주기 ID',
      dataIndex: 'cycleId',
      key: 'cycleId',
      width: 80,
    },
    {
      title: '주기명',
      dataIndex: 'cycleName',
      key: 'cycleName',
      width: 150,
    },
    {
      title: '기준 시작일',
      dataIndex: 'baseStartTime',
      key: 'baseStartTime',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
      width: 150,
    },
    {
      title: '인스턴스 간격',
      dataIndex: 'instanceIntervalMinutes',
      key: 'instanceIntervalMinutes',
      render: (minutes: number) => `${minutes}분`,
      width: 120,
    },
    {
      title: '신청 마감',
      dataIndex: 'applicationCloseMinutes',
      key: 'applicationCloseMinutes',
      render: (minutes: number) => `${minutes}분`,
      width: 100,
    },
    {
      title: '매칭 실행',
      dataIndex: 'matchingExecMinutes',
      key: 'matchingExecMinutes',
      render: (minutes: number) => `${minutes}분`,
      width: 100,
    },
    {
      title: '매칭 시작',
      dataIndex: 'matchStartMinutes',
      key: 'matchStartMinutes',
      render: (minutes: number) => `${minutes}분`,
      width: 100,
    },
    {
      title: '매칭 지속',
      dataIndex: 'matchDurationMinutes',
      key: 'matchDurationMinutes',
      render: (minutes: number) => `${minutes}분`,
      width: 100,
    },
    {
      title: '활성화',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean, record: Matching) => {
        return (
          <Switch
            checked={active}
            onChange={() => handleToggleActive(record.cycleId, !active)}
            size="small"
          />
        );
      },
      width: 80,
    },
    {
      title: '조치',
      key: 'actions',
      render: (_: any, record: Matching) => (
        <Space>
          <Button size="small" onClick={() => handleEdit(record)}>
            수정
          </Button>
          <Button
            size="small"
            onClick={() => handleViewInstances(record.cycleId)}
          >
            인스턴스
          </Button>
          <Button
            size="small"
            onClick={() => handleViewTeams(record.cycleId)}
          >
            팀 구성
          </Button>
          <Popconfirm
            title="매칭 주기 삭제"
            description="정말로 이 매칭 주기를 삭제하시겠습니까?"
            onConfirm={() => handleDelete(record.cycleId)}
            okText="삭제"
            cancelText="취소"
          >
            <Button size="small" danger>
              삭제
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: 200,
    },
  ];

  const instanceColumns = [
    { title: '인스턴스 ID', dataIndex: 'instanceId', key: 'instanceId' },
    {
      title: '시작일',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '종료일',
      dataIndex: 'endTime',
      key: 'endTime',
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '상태',
      dataIndex: 'status',
      key: 'status',
      render: (status: MatchingInstance['status']) => (
        <Tag color={statusColorMap[status]}>{statusLabelMap[status]}</Tag>
      ),
    },
    { title: '참가자 수', dataIndex: 'participantCount', key: 'participantCount' },
    { title: '팀 수', dataIndex: 'teamCount', key: 'teamCount' },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 'bold', margin: 0 }}>매칭 주기 관리</h1>
        <Button type="primary" onClick={handleCreate}>
          매칭 주기 생성
        </Button>
      </div>

      <Table
        dataSource={matchings}
        columns={columns}
        rowKey="cycleId"
        loading={loading}
        scroll={{ x: 1200 }}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} / 총 ${total}개`,
          onChange: (page, pageSize) => loadMatchings(page, pageSize || 10),
        }}
      />

      <MatchingForm
        open={isModalOpen}
        onCancel={handleCancel}
        onFinish={handleFinish}
        initialValues={editingMatching}
      />

      {/* 인스턴스 모달 */}
      <Modal
        title="매칭 인스턴스 목록"
        open={instancesModalVisible}
        onCancel={() => setInstancesModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={instances}
          columns={instanceColumns}
          rowKey="instanceId"
          pagination={false}
        />
      </Modal>

      {/* 팀 구성 모달 */}
      <Modal
        title="팀 구성 목록"
        open={teamsModalVisible}
        onCancel={() => setTeamsModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table
          dataSource={teams}
          columns={[
            { title: '팀 ID', dataIndex: 'teamId', key: 'teamId' },
            { title: '팀명', dataIndex: 'teamName', key: 'teamName' },
            { title: '멤버 수', dataIndex: 'memberCount', key: 'memberCount' },
          ]}
          rowKey="teamId"
          pagination={false}
        />
      </Modal>
    </div>
  );
};

export default MatchingPage;