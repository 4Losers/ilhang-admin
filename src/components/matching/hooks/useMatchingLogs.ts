import { useState, useEffect } from 'react';
import { message } from 'antd';
import { MatchingLog, LogFilter } from '../../../services/matching/types';
import { fetchMatchingLogs } from '../../../services/matching/api';

export const useMatchingLogs = () => {
    // 상태 관리
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<MatchingLog[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 필터 상태
    const [filter, setFilter] = useState<LogFilter>({});
    const [filterVisible, setFilterVisible] = useState(false);

    // 상세 모달 상태
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedLog, setSelectedLog] = useState<MatchingLog | null>(null);

    // 데이터 로드 함수
    const loadLogs = async (page: number = 1, size: number = 10, filters: LogFilter = {}) => {
        try {
            setLoading(true);
            const data = await fetchMatchingLogs({
                ...filters,
                page,
                size
            });
            setLogs(data.content);
            setTotal(data.totalElements);
            setCurrentPage(data.currentPage);
            setPageSize(data.pageSize);
        } catch (error) {
            console.error('매칭 로그 로드 실패:', error);
            message.error('매칭 로그를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 이벤트 핸들러들
    const handleRefresh = () => {
        loadLogs(currentPage, pageSize, filter);
    };

    const handlePageChange = (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size);
        loadLogs(page, size, filter);
    };

    const handleFilterSubmit = (values: any) => {
        const newFilter: LogFilter = {
            ...values,
            startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
            endDate: values.dateRange?.[1]?.format('YYYY-MM-DD')
        };
        delete (newFilter as any).dateRange;

        setFilter(newFilter);
        setFilterVisible(false);
        loadLogs(1, pageSize, newFilter);
    };

    const handleFilterReset = () => {
        setFilter({});
        setFilterVisible(false);
        loadLogs(1, pageSize, {});
    };

    const handleViewDetail = (log: MatchingLog) => {
        setSelectedLog(log);
        setDetailModalVisible(true);
    };

    const handleCloseDetailModal = () => {
        setDetailModalVisible(false);
        setSelectedLog(null);
    };

    const toggleFilterVisible = () => {
        setFilterVisible(!filterVisible);
    };

    // 초기 데이터 로드
    useEffect(() => {
        loadLogs();
    }, []);

    return {
        // 상태
        loading,
        logs,
        total,
        currentPage,
        pageSize,
        filter,
        filterVisible,
        detailModalVisible,
        selectedLog,

        // 핸들러
        handleRefresh,
        handlePageChange,
        handleFilterSubmit,
        handleFilterReset,
        handleViewDetail,
        handleCloseDetailModal,
        toggleFilterVisible,
    };
}; 