import { Layout } from 'antd';

const AppHeader = () => {
  return (
    <Layout.Header
      style={{
        background: '#001529',
        color: 'white',
        padding: '0 24px',
        fontSize: 18,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      일행 관리자 페이지
    </Layout.Header>
  );
};

export default AppHeader;