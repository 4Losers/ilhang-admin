// missionUtils.ts - 미션 관련 유틸리티 함수들

// ✅ 유효성 검사 유틸리티
export const validateMissionTemplate = (data: {
    title: string;
    description: string;
    categoryId: number;
    type: string;
}): { title: boolean; description: boolean; categoryId: boolean; type: boolean } => {
    return {
        title: !data.title.trim(),
        description: !data.description.trim(),
        categoryId: !data.categoryId,
        type: !data.type,
    };
};

export const validateCategory = (data: {
    name: string;
    description: string;
}): { name: boolean; description: boolean } => {
    return {
        name: !data.name.trim(),
        description: !data.description.trim(),
    };
};

export const hasValidationErrors = (errors: Record<string, boolean>): boolean => {
    return Object.values(errors).some(Boolean);
};

// ✅ 기본값 설정 유틸리티
export const getDefaultMissionDetail = () => ({
    goodPoints: [],
    howToProceed: [],
    certification: {
        description: '',
        deadline: '',
        examples: [],
    },
    challengeInfo: {
        availableCycles: [],
        estimatedDuration: '',
    },
    relatedMissionIds: [],
});

// ✅ 안전한 배열 업데이트 유틸리티
export const updateArrayItem = <T extends { [key: string]: any }>(
    array: T[],
    idField: keyof T,
    id: any,
    field: keyof T,
    value: any
): T[] => {
    return array.map(item =>
        item[idField] === id ? { ...item, [field]: value } : item
    );
};

// ✅ 스타일 상수
export const MISSION_STYLES = {
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        marginBottom: 8,
    },
    subsection: {
        marginBottom: 16,
    },
    subsectionTitle: {
        marginBottom: 8,
    },
    clickableTitle: {
        cursor: 'pointer',
        color: '#1890ff',
        fontWeight: 'bold',
        textDecoration: 'underline',
    },
    description: {
        color: '#666',
    },
    metaInfo: {
        fontSize: 12,
    },
    image: {
        width: 120,
        height: 'auto',
        objectFit: 'cover' as const,
        borderRadius: 4,
        marginBottom: 4,
    },
} as const; 