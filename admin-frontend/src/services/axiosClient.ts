// src/services/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://api.ilhang.com', // ⚠️ 실제 API 주소로 교체
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (필요 시 토큰 자동 추가)
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers = config.headers || {}; // <= 여기 추가!
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// 응답 인터셉터 (에러 처리 등)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;
