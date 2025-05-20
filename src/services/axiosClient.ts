import axios from 'axios';

// Axios 인스턴스 생성
const axiosClient = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 인증 필요 없는 경로는 토큰 제외
axiosClient.interceptors.request.use(
  (config) => {
    const noAuthRequired = ['/admin/login', '/admin/register']; // 토큰 없이 접근 가능한 경로
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

// 응답 인터셉터 - 에러 처리
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;