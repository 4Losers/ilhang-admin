import React from 'react';
import { Breadcrumb } from 'antd';

interface PageLayoutProps {
    children: React.ReactNode;
    title?: string;
    breadcrumb?: Array<{ title: string; path?: string }>;
    extra?: React.ReactNode;
    showBreadcrumb?: boolean;
}

const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    title,
    breadcrumb = [],
    extra,
    showBreadcrumb = true,
}) => {
    return (
        <div style={{ minHeight: '100%' }}>
            {/* 페이지 헤더 영역 */}
            {(title || extra || (showBreadcrumb && breadcrumb.length > 0)) && (
                <div style={{ marginBottom: 24 }}>
                    {showBreadcrumb && breadcrumb.length > 0 && (
                        <Breadcrumb
                            items={breadcrumb}
                            style={{ marginBottom: 16 }}
                        />
                    )}

                    {(title || extra) && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 16
                        }}>
                            {title && (
                                <h1 style={{
                                    fontSize: 24,
                                    fontWeight: 600,
                                    color: '#262626',
                                    margin: 0
                                }}>
                                    {title}
                                </h1>
                            )}
                            {extra && (
                                <div style={{
                                    display: 'flex',
                                    gap: 8,
                                    alignItems: 'center'
                                }}>
                                    {extra}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* 페이지 컨텐츠 영역 */}
            <div style={{
                background: '#fff',
                borderRadius: 8,
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                padding: 24
            }}>
                {children}
            </div>
        </div>
    );
};

export default PageLayout; 