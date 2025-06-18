import { useEffect, useState } from 'react';
import { Table, Button, Input, Space, notification } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
    fetchCategories,
    createCategory,
    updateCategory,
    MissionCategoryResponse,
} from '@/services/categoryService';
import { validateCategory, hasValidationErrors } from '@/utils/missionUtils';

interface MissionCategoryWithEdit extends MissionCategoryResponse {
    isEditing?: boolean;
    isNew?: boolean;
}

type Props = {
    onCategoryChange: () => Promise<void>;
};

const MissionCategoryTab = ({ onCategoryChange }: Props) => {
    const [localCategories, setLocalCategories] = useState<MissionCategoryWithEdit[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [validationError, setValidationError] = useState({
        name: false,
        description: false,
    });

    const load = async () => {
        try {
            const data = await fetchCategories();
            setLocalCategories(data);
        } catch (e) {
            console.error(e);
            notification.error({
                message: '카테고리 불러오기 실패',
                description: '서버에서 카테고리 목록을 가져오는 데 실패했습니다.',
            });
        }
    };

    const handleCreate = async () => {
        const errors = validateCategory(newCategory);
        setValidationError(errors);

        if (hasValidationErrors(errors)) {
            notification.warning({
                message: '입력값 확인',
                description: '이름과 설명을 모두 입력해주세요.',
            });
            return;
        }

        try {
            await createCategory(newCategory);
            notification.success({
                message: '카테고리 생성 완료',
                description: `'${newCategory.name}' 카테고리가 성공적으로 추가되었습니다.`,
            });
            await onCategoryChange();
            setIsCreating(false);
            setNewCategory({ name: '', description: '' });
            setValidationError({ name: false, description: false });
            load();
        } catch (e) {
            console.error(e);
            notification.error({
                message: '카테고리 생성 실패',
                description: '서버 요청 중 문제가 발생했습니다.',
            });
        }
    };

    const handleUpdate = async (record: MissionCategoryWithEdit) => {
        const errors = validateCategory(record);

        if (hasValidationErrors(errors)) {
            notification.warning({
                message: '입력값 확인',
                description: '이름과 설명을 모두 입력해주세요.',
            });
            return;
        }

        try {
            await updateCategory(record.categoryId, record);
            notification.success({
                message: '카테고리 수정 완료',
                description: `'${record.name}' 카테고리가 성공적으로 수정되었습니다.`,
            });
            load();
        } catch (e) {
            console.error(e);
            notification.error({
                message: '카테고리 수정 실패',
                description: '저장 중 문제가 발생했습니다.',
            });
        }
    };

    useEffect(() => {
        load();
    }, []);

    const displayData: MissionCategoryWithEdit[] = isCreating
        ? [{ categoryId: -1, isNew: true, ...newCategory }, ...localCategories]
        : localCategories;

    const columns: ColumnsType<MissionCategoryWithEdit> = [
        {
            title: 'ID',
            dataIndex: 'categoryId',
            render: (_, record) => (record.isNew ? '—' : record.categoryId),
        },
        {
            title: '이름',
            dataIndex: 'name',
            render: (value, record) =>
                record.isNew || record.isEditing ? (
                    <Input
                        value={record.name}
                        status={record.isNew && validationError.name ? 'error' : ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (record.isNew) {
                                setNewCategory((prev) => ({ ...prev, name: value }));
                            } else {
                                setLocalCategories((prev) =>
                                    prev.map((c) =>
                                        c.categoryId === record.categoryId ? { ...c, name: value } : c
                                    )
                                );
                            }
                        }}
                    />
                ) : (
                    value
                ),
        },
        {
            title: '설명',
            dataIndex: 'description',
            render: (value, record) =>
                record.isNew || record.isEditing ? (
                    <Input
                        value={record.description}
                        status={record.isNew && validationError.description ? 'error' : ''}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (record.isNew) {
                                setNewCategory((prev) => ({ ...prev, description: value }));
                            } else {
                                setLocalCategories((prev) =>
                                    prev.map((c) =>
                                        c.categoryId === record.categoryId ? { ...c, description: value } : c
                                    )
                                );
                            }
                        }}
                    />
                ) : (
                    value
                ),
        },
        {
            title: '액션',
            key: 'actions',
            render: (_, record) => {
                if (record.isNew) {
                    return (
                        <Space>
                            <Button type="primary" size="small" onClick={handleCreate}>
                                저장
                            </Button>
                            <Button danger size="small" onClick={() => setIsCreating(false)}>
                                취소
                            </Button>
                        </Space>
                    );
                } else if (record.isEditing) {
                    return (
                        <Space>
                            <Button type="primary" size="small" onClick={() => handleUpdate(record)}>
                                저장
                            </Button>
                            <Button size="small" onClick={() => load()}>
                                취소
                            </Button>
                        </Space>
                    );
                } else {
                    return (
                        <Button
                            size="small"
                            onClick={() =>
                                setLocalCategories((prev) =>
                                    prev.map((c) =>
                                        c.categoryId === record.categoryId ? { ...c, isEditing: true } : c
                                    )
                                )
                            }
                        >
                            수정
                        </Button>
                    );
                }
            },
        },
    ];

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
                <div>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold' }}>미션 카테고리 목록</h1>
                    <p style={{ marginBottom: 0, color: '#888' }}>
                        카테고리 이름과 설명을 관리할 수 있습니다.
                    </p>
                </div>
                {!isCreating && (
                    <Button type="primary" onClick={() => setIsCreating(true)}>
                        ➕ 카테고리 추가
                    </Button>
                )}
            </div>

            <Table
                dataSource={displayData}
                columns={columns}
                rowKey="categoryId"
                pagination={{ pageSize: 10 }}
            />
        </div>
    );
};

export default MissionCategoryTab;