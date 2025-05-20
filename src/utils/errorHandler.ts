// utils/handleApiError.ts
import { message } from 'antd';

export function handleApiError(error: any, customMessage?: string) {
    if (error.response) {
        const { status, data } = error.response;

        switch (status) {
            case 401:
                message.error('이메일 또는 비밀번호가 올바르지 않습니다.');
                break;
            case 403:
                message.error('접근 권한이 없습니다.');
                break;
            case 429:
                message.error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
                break;
            case 500:
                message.error('서버 오류입니다. 관리자에게 문의해주세요.');
                break;
            default:
                message.error(data?.message || customMessage || '알 수 없는 오류가 발생했습니다.');
        }
    } else if (error.request) {
        message.error('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
    } else {
        message.error(customMessage || '예상치 못한 오류가 발생했습니다.');
    }
}