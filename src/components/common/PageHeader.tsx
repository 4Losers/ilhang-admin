import React from 'react';
import { Typography, Space, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    actions?: Array<{
        key: string;
        label: string;
        type?: 'primary' | 'default' | 'dashed' | 'link' | 'text';
        icon?: React.ReactNode;
        onClick: () => void;
        loading?: boolean;
    }>;
    onRefresh?: () => void;
    refreshLoading?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    subtitle,
    actions = [],
    onRefresh,
    refreshLoading = false,
}) => {
    return (
        <div style={{
            marginBottom: 24,
            padding: '24px 0',
            borderBottom: '1px solid #f0f0f0'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
            }}>
                <div>
                    <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
                        {title}
                    </Title>
                    {subtitle && (
                        <Text type="secondary" style={{ fontSize: 14 }}>
                            {subtitle}
                        </Text>
                    )}
                </div>

                <Space>
                    {onRefresh && (
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={onRefresh}
                            loading={refreshLoading}
                        >
                            새로고침
                        </Button>
                    )}

                    {actions.map((action) => (
                        <Button
                            key={action.key}
                            type={action.type || 'default'}
                            icon={action.icon}
                            onClick={action.onClick}
                            loading={action.loading}
                        >
                            {action.label}
                        </Button>
                    ))}
                </Space>
            </div>
        </div>
    );
};

export default PageHeader; 