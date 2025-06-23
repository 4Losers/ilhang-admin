import React, { useEffect } from 'react';
import {
    Card,
    Form,
    Select,
    Button,
    Space
} from 'antd';
import {
    SaveOutlined,
    ReloadOutlined,
    SettingOutlined
} from '@ant-design/icons';
import { useMatchingSettings } from './hooks/useMatchingSettings';
import { DEFAULT_MATCHING_SETTINGS } from './utils/defaultSettings';
import MatchingStrategySection from './components/MatchingStrategySection';
import TeamSizeSection from './components/TeamSizeSection';
import PriorityConditionsSection from './components/PriorityConditionsSection';
import AutoMatchingSection from './components/AutoMatchingSection';
import SettingsPreviewSection from './components/SettingsPreviewSection';

const { Option } = Select;

interface MatchingSettingsPanelProps {
    className?: string;
}

const MatchingSettingsPanel: React.FC<MatchingSettingsPanelProps> = ({ className }) => {
    const {
        loading,
        saving,
        cycles,
        selectedCycleId,
        handleCycleChange,
        handleSave,
        handleReset,
    } = useMatchingSettings();

    const [form] = Form.useForm();

    // 주기 변경 시 폼 초기화
    useEffect(() => {
        if (selectedCycleId) {
            handleCycleChange(selectedCycleId).then((settings) => {
                if (settings) {
                    form.setFieldsValue(settings);
                } else {
                    form.setFieldsValue(DEFAULT_MATCHING_SETTINGS);
                }
            });
        }
    }, [selectedCycleId, handleCycleChange, form]);

    const handleFormSubmit = async (values: any) => {
        const success = await handleSave(values);
        if (success) {
            // 폼 값 업데이트
            form.setFieldsValue(values);
        }
    };

    const handleFormReset = async () => {
        const settings = await handleReset();
        if (settings) {
            form.setFieldsValue(settings);
        } else {
            form.setFieldsValue(DEFAULT_MATCHING_SETTINGS);
        }
    };

    return (
        <div className={`matching-settings-panel ${className || ''}`}>
            <Card
                title={
                    <Space>
                        <SettingOutlined />
                        <span>매칭 설정</span>
                    </Space>
                }
                extra={
                    <Space>
                        <Select
                            placeholder="주기 선택"
                            value={selectedCycleId}
                            onChange={handleCycleChange}
                            style={{ width: 200 }}
                        >
                            {cycles.map(cycle => (
                                <Option key={cycle.id} value={cycle.id}>
                                    {cycle.name}
                                </Option>
                            ))}
                        </Select>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleFormReset}
                            loading={loading}
                        >
                            초기화
                        </Button>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={() => form.submit()}
                            loading={saving}
                        >
                            저장
                        </Button>
                    </Space>
                }
            >
                {selectedCycleId ? (
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleFormSubmit}
                        initialValues={DEFAULT_MATCHING_SETTINGS}
                    >
                        <MatchingStrategySection />
                        <TeamSizeSection />
                        <PriorityConditionsSection />
                        <AutoMatchingSection />
                        <SettingsPreviewSection />
                    </Form>
                ) : (
                    <div style={{ textAlign: 'center', color: '#999', padding: '40px' }}>
                        먼저 주기를 선택해주세요
                    </div>
                )}
            </Card>
        </div>
    );
};

export default MatchingSettingsPanel; 