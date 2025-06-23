import { useState, useEffect } from 'react';
import { message } from 'antd';
import { MatchApplicant, ApplicantFilter } from '../../../services/matching/types';
import {
    fetchMatchApplicants,
    updateApplicantStatus,
    assignApplicantToGroup
} from '../../../services/matching/api';

export const useApplicantManagement = () => {
    // 상태 관리
    const [loading, setLoading] = useState(false);
    const [applicants, setApplicants] = useState<MatchApplicant[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 필터 상태
    const [filter, setFilter] = useState<ApplicantFilter>({});
    const [filterVisible, setFilterVisible] = useState(false);

    // 모달 상태
    const [assignModalVisible, setAssignModalVisible] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState<MatchApplicant | null>(null);

    // 데이터 로드 함수
    const loadApplicants = async (page: number = 1, size: number = 10, filters: ApplicantFilter = {}) => {
        try {
            setLoading(true);
            const data = await fetchMatchApplicants({
                ...filters,
                page,
                size
            });
            setApplicants(data.content);
            setTotal(data.totalElements);
            setCurrentPage(data.currentPage);
            setPageSize(data.pageSize);
        } catch (error) {
            console.error('신청자 목록 로드 실패:', error);
            message.error('신청자 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 이벤트 핸들러들
    const handleRefresh = () => {
        loadApplicants(currentPage, pageSize, filter);
    };

    const handlePageChange = (page: number, size: number) => {
        setCurrentPage(page);
        setPageSize(size);
        loadApplicants(page, size, filter);
    };

    const handleFilterSubmit = (values: any) => {
        const newFilter: ApplicantFilter = {
            ...values,
            startDate: values.dateRange?.[0]?.format('YYYY-MM-DD'),
            endDate: values.dateRange?.[1]?.format('YYYY-MM-DD')
        };
        delete (newFilter as any).dateRange;

        setFilter(newFilter);
        setFilterVisible(false);
        loadApplicants(1, pageSize, newFilter);
    };

    const handleFilterReset = () => {
        setFilter({});
        setFilterVisible(false);
        loadApplicants(1, pageSize, {});
    };

    const handleStatusChange = async (applicant: MatchApplicant, status: 'ACCEPTED' | 'REJECTED' | 'CANCELLED') => {
        try {
            await updateApplicantStatus(applicant.id, status);
            message.success('신청자 상태가 변경되었습니다.');
            handleRefresh();
        } catch (error) {
            console.error('상태 변경 실패:', error);
            message.error('상태 변경에 실패했습니다.');
        }
    };

    const handleAssignGroup = (applicant: MatchApplicant) => {
        setSelectedApplicant(applicant);
        setAssignModalVisible(true);
    };

    const handleAssignSubmit = async (values: any) => {
        if (!selectedApplicant) return false;

        try {
            await assignApplicantToGroup(selectedApplicant.id, values.groupId);
            message.success('신청자가 그룹에 배정되었습니다.');
            setAssignModalVisible(false);
            handleRefresh();
            return true;
        } catch (error) {
            console.error('그룹 배정 실패:', error);
            message.error('그룹 배정에 실패했습니다.');
            return false;
        }
    };

    const handleCloseAssignModal = () => {
        setAssignModalVisible(false);
        setSelectedApplicant(null);
    };

    const toggleFilterVisible = () => {
        setFilterVisible(!filterVisible);
    };

    // 초기 데이터 로드
    useEffect(() => {
        loadApplicants();
    }, []);

    return {
        // 상태
        loading,
        applicants,
        total,
        currentPage,
        pageSize,
        filter,
        filterVisible,
        assignModalVisible,
        selectedApplicant,

        // 핸들러
        handleRefresh,
        handlePageChange,
        handleFilterSubmit,
        handleFilterReset,
        handleStatusChange,
        handleAssignGroup,
        handleAssignSubmit,
        handleCloseAssignModal,
        toggleFilterVisible,
    };
}; 