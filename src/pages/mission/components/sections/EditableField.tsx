import { Input, Select } from 'antd';
import React from 'react';

interface EditableFieldProps {
    label: string;
    value: any;
    editMode: boolean;
    onChange: (value: any) => void;
    type?: 'text' | 'select' | 'textarea';
    options?: { value: any; label: string }[];
    placeholder?: string;
    style?: React.CSSProperties;
}

const EditableField: React.FC<EditableFieldProps> = ({
    label,
    value,
    editMode,
    onChange,
    type = 'text',
    options = [],
    placeholder,
    style
}) => {
    const renderEditField = () => {
        switch (type) {
            case 'select':
                return (
                    <Select
                        value={value}
                        onChange={onChange}
                        style={{ width: 200, ...style }}
                        placeholder={placeholder}
                    >
                        {options.map(option => (
                            <Select.Option key={option.value} value={option.value}>
                                {option.label}
                            </Select.Option>
                        ))}
                    </Select>
                );
            case 'textarea':
                return (
                    <Input.TextArea
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        style={{ width: '100%', ...style }}
                        placeholder={placeholder}
                        rows={3}
                    />
                );
            default:
                return (
                    <Input
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        style={{ width: 300, ...style }}
                        placeholder={placeholder}
                    />
                );
        }
    };

    return (
        <div style={{ marginBottom: 8 }}>
            <strong>{label}:</strong>{' '}
            {editMode ? renderEditField() : (value || '')}
        </div>
    );
};

export default EditableField; 