import { Button, Space } from 'antd';
import React from 'react';

interface SectionHeaderProps {
    title: string;
    editMode: boolean;
    onEditToggle: () => void;
    onSave: () => Promise<void>;
    onCancel: () => void;
    showAddButton?: boolean;
    onAdd?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    editMode,
    onEditToggle,
    onSave,
    onCancel,
    showAddButton = false,
    onAdd
}) => {
    return (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h4 style={{ margin: 0 }}>{title}</h4>
            <Space>
                {editMode ? (
                    <>
                        {showAddButton && onAdd && (
                            <Button size="small" onClick={onAdd}>
                                ➕ 추가
                            </Button>
                        )}
                        <Button onClick={onCancel}>❌ 취소</Button>
                        <Button type="primary" onClick={onSave}>💾 저장</Button>
                    </>
                ) : (
                    <Button type="primary" onClick={onEditToggle}>✏️ 수정</Button>
                )}
            </Space>
        </div>
    );
};

export default SectionHeader; 