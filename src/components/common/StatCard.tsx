import React from 'react';
import { Card, Statistic, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

interface StatCardProps {
    title: string;
    value: number | string;
    prefix?: React.ReactNode;
    suffix?: string;
    color?: string;
    trend?: {
        value: number;
        isPositive: boolean;
        label: string;
    };
    loading?: boolean;
    onClick?: () => void;
    tooltip?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    prefix,
    suffix,
    color = '#1890ff',
    trend,
    loading = false,
    onClick,
    tooltip,
}) => {
    const cardContent = (
        <Card
            hoverable={!!onClick}
            onClick={onClick}
            loading={loading}
            style={{
                cursor: onClick ? 'pointer' : 'default',
                transition: 'all 0.3s ease'
            }}
            bodyStyle={{ padding: '20px 24px' }}
        >
            <Statistic
                title={
                    <span style={{
                        fontSize: 14,
                        color: '#8c8c8c',
                        fontWeight: 500
                    }}>
                        {title}
                    </span>
                }
                value={value}
                prefix={prefix}
                suffix={suffix}
                valueStyle={{
                    color,
                    fontSize: 28,
                    fontWeight: 600
                }}
            />

            {trend && (
                <div style={{
                    marginTop: 8,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                }}>
                    {trend.isPositive ? (
                        <ArrowUpOutlined style={{ color: '#52c41a', fontSize: 12 }} />
                    ) : (
                        <ArrowDownOutlined style={{ color: '#ff4d4f', fontSize: 12 }} />
                    )}
                    <span style={{
                        fontSize: 12,
                        color: trend.isPositive ? '#52c41a' : '#ff4d4f',
                        fontWeight: 500
                    }}>
                        {trend.value}% {trend.label}
                    </span>
                </div>
            )}
        </Card>
    );

    if (tooltip) {
        return (
            <Tooltip title={tooltip} placement="top">
                {cardContent}
            </Tooltip>
        );
    }

    return cardContent;
};

export default StatCard; 