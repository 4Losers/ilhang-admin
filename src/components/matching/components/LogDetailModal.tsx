import React from 'react';
import { Modal, Descriptions, Tag, Button } from 'antd';
import { MatchingLog } from '../../../services/matching/types';
import dayjs from 'dayjs';

interface LogDetailModalProps {
    visible: boolean;
    onCancel: () => void;
    selectedLog: MatchingLog | null;
}

// 액션별 색상 및 텍스트
const getActionConfig = (action: string) => {
    const config = {
        'GROUP_CANCEL': { color: 'red', text: '그룹 취소', icon: '🚫' },
        'TEAM_CANCEL': { color: 'orange', text: '팀 취소', icon: '⚠️' },
        'USER_DROP': { color: 'red', text: '사용자 탈락', icon: '👤' },
        'MANUAL_MATCH': { color: 'blue', text: '수동 매칭', icon: '⚙️' },
        'SETTING_CHANGE': { color: 'purple', text: '설정 변경', icon: '🔧' }
    };
    return config[action as keyof typeof config] || { color: 'default', text: action, icon: '❓' };
};

const getTargetTypeConfig = (targetType: string) => {
    const config = {
        'GROUP': { color: 'blue', text: '그룹' },
        'TEAM': { color: 'green', text: '팀' },
        'USER': { color: 'orange', text: '사용자' },
        'INSTANCE': { color: 'purple', text: '회차' },
        'CYCLE': { color: 'cyan', text: '주기' }
    };
    return config[targetType as keyof typeof config] || { color: 'default', text: targetType };
};

const LogDetailModal: React.FC<LogDetailModalProps> = ({
    visible,
    onCancel,
    selectedLog
}) => {
    return (
        <Modal
            title="로그 상세"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel}>
                    닫기
                </Button>
            ]}
            width={600}
        >
            {selectedLog && (
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="시간">
                        {dayjs(selectedLog.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                    </Descriptions.Item>
                    <Descriptions.Item label="관리자">
                        {selectedLog.adminName} (ID: {selectedLog.adminId})
                    </Descriptions.Item>
                    <Descriptions.Item label="액션">
                        <Tag color={getActionConfig(selectedLog.action).color}>
                            {getActionConfig(selectedLog.action).icon} {getActionConfig(selectedLog.action).text}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="대상 타입">
                        <Tag color={getTargetTypeConfig(selectedLog.targetType).color}>
                            {getTargetTypeConfig(selectedLog.targetType).text}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="대상">
                        {selectedLog.targetName} (ID: {selectedLog.targetId})
                    </Descriptions.Item>
                    <Descriptions.Item label="설명">
                        {selectedLog.description}
                    </Descriptions.Item>
                    {selectedLog.details && (
                        <Descriptions.Item label="상세 정보">
                            <pre style={{ fontSize: '12px', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                                {JSON.stringify(selectedLog.details, null, 2)}
                            </pre>
                        </Descriptions.Item>
                    )}
                </Descriptions>
            )}
        </Modal>
    );
};

export default LogDetailModal; 