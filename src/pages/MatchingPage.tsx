import React, { useState } from 'react';
import { Tabs, message } from 'antd';
import {
    DashboardOutlined,
    SettingOutlined,
    UserOutlined,
    HistoryOutlined,
    TeamOutlined
} from '@ant-design/icons';

// 새로운 컴포넌트들
import {
    MatchStatusPanel,
    CycleManagementPanel,
    ApplicantManagementPanel,
    MatchingLogPanel,
    MatchingSettingsPanel
} from '../components/matching';

const { TabPane } = Tabs;

const MatchingPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('status');

    const handleTabChange = (key: string) => {
        setActiveTab(key);
    };

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ marginBottom: '24px' }}>
                <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>
                    🤝 매칭 관리
                </h1>
                <p style={{ margin: '8px 0 0 0', color: '#666', fontSize: '16px' }}>
                    매칭 현황, 주기 관리, 신청자 관리, 로그 및 설정을 관리합니다
                </p>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                type="card"
                size="large"
                style={{ marginBottom: '24px' }}
            >
                <TabPane
                    tab={
                        <span>
                            <DashboardOutlined />
                            매치 현황
                        </span>
                    }
                    key="status"
                >
                    <MatchStatusPanel />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <TeamOutlined />
                            매치 회차 관리
                        </span>
                    }
                    key="cycles"
                >
                    <CycleManagementPanel />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <UserOutlined />
                            신청자 관리
                        </span>
                    }
                    key="applicants"
                >
                    <ApplicantManagementPanel />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <HistoryOutlined />
                            매칭 로그
                        </span>
                    }
                    key="logs"
                >
                    <MatchingLogPanel />
                </TabPane>

                <TabPane
                    tab={
                        <span>
                            <SettingOutlined />
                            설정
                        </span>
                    }
                    key="settings"
                >
                    <MatchingSettingsPanel />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default MatchingPage; 