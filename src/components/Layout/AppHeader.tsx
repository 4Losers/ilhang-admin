import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const AppHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // accessToken 제거
    localStorage.removeItem('accessToken');
    // 로그인 페이지로 이동
    navigate('/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: '100%',
        backgroundColor: '#fff',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: 20 }}>일행 관리자 페이지</div>

      <Button type="primary" danger onClick={handleLogout}>
        로그아웃
      </Button>
    </div>
  );
};

export default AppHeader;