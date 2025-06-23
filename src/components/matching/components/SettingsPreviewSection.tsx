import React from 'react';
import { Card, Alert } from 'antd';

const SettingsPreviewSection: React.FC = () => {
    return (
        <Card size="small" title="설정 미리보기" style={{ marginTop: '16px' }}>
            <Alert
                message="현재 설정된 매칭 조건"
                description={
                    <div>
                        <p>• 매칭 알고리즘: 성공률 기반 매칭</p>
                        <p>• 팀 크기: 2-6명 (선호: 4명)</p>
                        <p>• 우선순위: 성공률, 레벨 유사성</p>
                        <p>• 자동 매칭: 활성화 (30분 지연, 최대 3회 재시도)</p>
                    </div>
                }
                type="info"
                showIcon
            />
        </Card>
    );
};

export default SettingsPreviewSection; 