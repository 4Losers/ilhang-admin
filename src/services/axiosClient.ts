import axios from 'axios';

// Axios 인스턴스 생성
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 함수
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('Refresh token not found');
    }

    const response = await axios.post('http://localhost:8080/auth/refresh', {
      refreshToken,
    });

    const { accessToken, refreshToken: newRefreshToken } = response.data as {
      accessToken: string;
      refreshToken: string;
    };
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    return accessToken;
  } catch (error) {
    // Refresh token도 만료된 경우 로그아웃 처리
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
    throw error;
  }
};

// 요청 인터셉터 - 인증 필요 없는 경로는 토큰 제외
axiosClient.interceptors.request.use(
  (config) => {
    const noAuthRequired = ['/admin/login', '/admin/register', '/auth/refresh']; // 토큰 없이 접근 가능한 경로
    const isPublic = noAuthRequired.some((url) => config.url?.includes(url));

    if (!isPublic) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 에러 처리 및 토큰 갱신
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error('❌ Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    // 기타 에러 처리
    console.error('❌ API Error:', error);

    // 사용자 친화적인 에러 메시지
    const errorMessage = error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.';
    console.error('❌ Error Message:', errorMessage);

    return Promise.reject(error);
  }
);

export default axiosClient;