import { useState, useEffect } from 'react';
import { message } from 'antd';
import dayjs from 'dayjs';
import {
    CycleConfigResponse,
    CycleConfigRequest,
    BackendPageResponse
} from '../../../services/matching/types';
import {
    getMatchCycles,
    createMatchCycle,
    updateMatchCycle,
    toggleMatchCycleActive
} from '../../../services/matching/api';

export const useCycleManagement = () => {
    // 상태 관리
    const [loading, setLoading] = useState(false);
    const [cyclesData, setCyclesData] = useState<BackendPageResponse<CycleConfigResponse> | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [cycleName, setCycleName] = useState<string>('');

    // 모달 상태
    const [cycleModalVisible, setCycleModalVisible] = useState(false);
    const [editingCycle, setEditingCycle] = useState<CycleConfigResponse | null>(null);

    // 데이터 로드 함수들
    const loadCycles = async (page: number = 1, size: number = 10, name?: string) => {
        try {
            setLoading(true);
            const data = await getMatchCycles(page, size, name);
            setCyclesData(data);
        } catch (error) {
            console.error('매치 주기 로드 실패:', error);
            message.error('매치 주기 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 이벤트 핸들러들
    const handleCreateCycle = () => {
        setEditingCycle(null);
        setCycleModalVisible(true);
    };

    const handleEditCycle = (cycle: CycleConfigResponse) => {
        setEditingCycle(cycle);
        setCycleModalVisible(true);
    };

    const handleCycleSubmit = async (values: any) => {
        try {
            setLoading(true);

            const request: CycleConfigRequest = {
                ...values,
                startTime: values.startTime.format('HH:mm')
            };

            if (editingCycle) {
                await updateMatchCycle(editingCycle.id, request);
                message.success('매치 주기가 수정되었습니다.');
            } else {
                await createMatchCycle(request);
                message.success('매치 주기가 생성되었습니다.');
            }

            setCycleModalVisible(false);
            await loadCycles(currentPage, pageSize, cycleName);
        } catch (error) {
            console.error('매치 주기 저장 실패:', error);
            message.error('매치 주기 저장에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    const handleToggleCycleStatus = async (cycle: CycleConfigResponse) => {
        try {
            await toggleMatchCycleActive(cycle.id);
            message.success('매치 주기 상태가 변경되었습니다.');
            await loadCycles(currentPage, pageSize, cycleName);
        } catch (error) {
            console.error('매치 주기 상태 변경 실패:', error);
            message.error('매치 주기 상태 변경에 실패했습니다.');
        }
    };

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current);
        setPageSize(pagination.pageSize);
        loadCycles(pagination.current, pagination.pageSize, cycleName);
    };

    const handleSearch = (value: string) => {
        setCycleName(value);
        setCurrentPage(1);
        loadCycles(1, pageSize, value);
    };

    const handleRefresh = async () => {
        await loadCycles(currentPage, pageSize, cycleName);
        message.success('데이터가 새로고침되었습니다.');
    };

    const handleCloseModal = () => {
        setCycleModalVisible(false);
        setEditingCycle(null);
    };

    // 초기 데이터 로드
    useEffect(() => {
        loadCycles(1, 10);
    }, []);

    return {
        // 상태
        loading,
        cyclesData,
        currentPage,
        pageSize,
        cycleName,
        cycleModalVisible,
        editingCycle,

        // 핸들러
        handleCreateCycle,
        handleEditCycle,
        handleCycleSubmit,
        handleToggleCycleStatus,
        handleTableChange,
        handleSearch,
        handleRefresh,
        handleCloseModal,
    };
}; 