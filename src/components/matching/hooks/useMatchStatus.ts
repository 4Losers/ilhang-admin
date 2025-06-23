import { useState, useEffect } from 'react';
import { message } from 'antd';
import {
    MatchInstance,
    MatchInstanceDetail,
    BackendPageResponse,
    MatchInstanceOverviewResponse
} from '../../../services/matching/types';
import {
    getMatchOverview,
    getMatchInstances,
    getMatchInstanceDetail
} from '../../../services/matching/api';
import { fetchMissions, MissionTemplateView } from '../../../services/missionService';

export const useMatchStatus = () => {
    // 상태 관리
    const [loading, setLoading] = useState(false);
    const [overviewData, setOverviewData] = useState<MatchInstance[]>([]);
    const [instancesData, setInstancesData] = useState<BackendPageResponse<MatchInstanceOverviewResponse> | null>(null);
    const [selectedInstance, setSelectedInstance] = useState<MatchInstanceDetail | null>(null);

    // 미션 정보 상태 추가
    const [missions, setMissions] = useState<MissionTemplateView[]>([]);
    const [instanceMissions, setInstanceMissions] = useState<Map<number, MissionTemplateView[]>>(new Map());
    const [instanceGroupCounts, setInstanceGroupCounts] = useState<Map<number, number>>(new Map());

    // 페이지네이션 상태
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 모달 상태
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    // 데이터 로드 함수들
    const loadOverview = async () => {
        try {
            const data = await getMatchOverview();
            setOverviewData(data);
        } catch (error) {
            console.error('매치 개요 로드 실패:', error);
            message.error('매치 개요를 불러오는데 실패했습니다.');
        }
    };

    const loadInstances = async (page: number = 1, size: number = 10) => {
        try {
            setLoading(true);
            const data = await getMatchInstances(page, size);
            console.log('=== 매치 인스턴스 API 응답 전체 ===');
            console.log('전체 응답:', JSON.stringify(data, null, 2));
            console.log('리스트 길이:', data?.list?.length);

            // 데이터 검증 및 정규화
            if (data?.list) {
                const normalizedList = data.list.map(instance => {
                    console.log('=== 개별 인스턴스 데이터 ===');
                    console.log('전체 인스턴스:', instance);
                    console.log('totalGroups 타입:', typeof instance.totalGroups, '값:', instance.totalGroups);
                    console.log('totalParticipants 타입:', typeof instance.totalParticipants, '값:', instance.totalParticipants);
                    console.log('totalTeams 타입:', typeof instance.totalTeams, '값:', instance.totalTeams);

                    return {
                        ...instance,
                        totalGroups: instance.totalGroups ?? 0,
                        totalParticipants: instance.totalParticipants ?? 0,
                        totalTeams: instance.totalTeams ?? 0,
                    };
                });

                data.list = normalizedList;
            }

            setInstancesData(data);

            // 미션 정보 매핑 (백그라운드에서 실행)
            if (data?.list && missions.length > 0) {
                loadInstanceMissions(data.list);
            }
        } catch (error) {
            console.error('매치 인스턴스 로드 실패:', error);
            message.error('매치 인스턴스 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const loadInstanceDetail = async (instanceId: number) => {
        try {
            const data = await getMatchInstanceDetail(instanceId);
            setSelectedInstance(data);
            setDetailModalVisible(true);
        } catch (error) {
            console.error('인스턴스 상세 로드 실패:', error);
            message.error('인스턴스 상세 정보를 불러오는데 실패했습니다.');
        }
    };

    // 미션 정보 로드 함수
    const loadMissions = async () => {
        try {
            const missionData = await fetchMissions();
            setMissions(missionData);
        } catch (error) {
            console.error('미션 정보 로드 실패:', error);
            message.error('미션 정보를 불러오는데 실패했습니다.');
        }
    };

    // 매치 인스턴스별 미션 정보 매핑 함수
    const loadInstanceMissions = async (instances: MatchInstanceOverviewResponse[]) => {
        const missionMap = new Map<number, MissionTemplateView[]>();
        const groupCountMap = new Map<number, number>();

        for (const instance of instances) {
            try {
                // 각 인스턴스의 상세 정보를 조회해서 groups의 missionId 추출
                const detail = await getMatchInstanceDetail(instance.instanceId);
                const missionIds = detail.groups.map(group => group.missionId);

                // 미션 정보 찾기
                const instanceMissions = missions.filter(mission =>
                    missionIds.includes(mission.templateId)
                );

                missionMap.set(instance.instanceId, instanceMissions);
                groupCountMap.set(instance.instanceId, detail.groups.length);
            } catch (error) {
                console.error(`인스턴스 ${instance.instanceId} 미션 정보 로드 실패:`, error);
                missionMap.set(instance.instanceId, []);
                groupCountMap.set(instance.instanceId, 0);
            }
        }

        setInstanceMissions(missionMap);
        setInstanceGroupCounts(groupCountMap);
    };

    // 이벤트 핸들러들
    const handleRefresh = async () => {
        setLoading(true);
        try {
            await Promise.all([
                loadOverview(),
                loadInstances(currentPage, pageSize),
                loadMissions()
            ]);
            message.success('데이터가 새로고침되었습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
        loadInstances(pagination.current, pagination.pageSize);
    };

    const handleViewDetail = (instanceId: number) => {
        loadInstanceDetail(instanceId);
    };

    const handleCloseModal = () => {
        setDetailModalVisible(false);
        setSelectedInstance(null);
    };

    // 초기 데이터 로드
    useEffect(() => {
        loadOverview();
        loadInstances(1, 10);
        loadMissions();
    }, []);

    // 미션 정보가 로드되면 매치 인스턴스의 미션 정보 매핑
    useEffect(() => {
        if (missions.length > 0 && instancesData?.list) {
            loadInstanceMissions(instancesData.list);
        }
    }, [missions, instancesData?.list]);

    return {
        // 상태
        loading,
        overviewData,
        instancesData,
        selectedInstance,
        missions,
        instanceMissions,
        instanceGroupCounts,
        currentPage,
        pageSize,
        detailModalVisible,

        // 핸들러
        handleRefresh,
        handleTableChange,
        handleViewDetail,
        handleCloseModal,
    };
}; 