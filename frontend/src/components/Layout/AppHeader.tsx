
import { Button, Space } from 'antd';
import { useNavigate } from 'react-router-dom';

const AppHeader = () => {
  const navigate = useNavigate();

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

      <Space>
        <Button type="link" onClick={() => navigate('/register')}>
          회원가입
        </Button>
        <Button type="primary" onClick={() => navigate('/login')}>
          로그인
        </Button>
      </Space>
    </div>
  );
};

export default AppHeader;
