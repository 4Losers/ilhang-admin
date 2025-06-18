import { MissionTemplateDetailResponse } from '@/services/missionService';

// Props 인터페이스
export interface MissionTemplateDetailDrawerProps {
    open: boolean;
    onClose: () => void;
    templateId: number | null;
    loading: boolean;
    detail: MissionTemplateDetailResponse | null;
    categories: { categoryId: number; name: string; description: string }[];
    onSave: () => Promise<MissionTemplateDetailResponse>;
}

// 각 섹션별 편집 모드 타입 (useEditModes에서 재export)
export interface EditModes {
    detail: boolean;
    instances: boolean;
    periods: boolean;
    points: boolean;
} 