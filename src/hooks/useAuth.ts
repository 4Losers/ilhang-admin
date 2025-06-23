import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { refreshToken } from '@/services/userService';

interface UserInfo {
    id: number;
    name: string;
    email: string;
    role: string;
}

export const useAuth = () => {
    const [user, setUser] = useState<UserInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            const accessToken = localStorage.getItem('accessToken');
            const userInfo = localStorage.getItem('userInfo');

            if (!accessToken) {
                setLoading(false);
                return;
            }

            if (userInfo) {
                try {
                    setUser(JSON.parse(userInfo));
                } catch (error) {
                    console.error('사용자 정보 파싱 실패:', error);
                }
            }

            setLoading(false);
        };

        initAuth();
    }, []);

    const login = (userInfo: UserInfo, accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        setUser(userInfo);
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userInfo');
        setUser(null);
        navigate('/login');
        message.success('로그아웃되었습니다.');
    };

    const refreshAuth = async () => {
        try {
            const response = await refreshToken();
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            localStorage.setItem('userInfo', JSON.stringify(response.user));
            setUser(response.user);
            return response.accessToken;
        } catch (error) {
            logout();
            throw error;
        }
    };

    const isAuthenticated = () => {
        return !!localStorage.getItem('accessToken');
    };

    const hasRole = (role: string) => {
        return user?.role === role;
    };

    return {
        user,
        loading,
        login,
        logout,
        refreshAuth,
        isAuthenticated,
        hasRole,
    };
}; 