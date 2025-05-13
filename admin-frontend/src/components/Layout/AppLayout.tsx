import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const { Sider, Content } = Layout;

const AppLayout = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff', boxShadow: '2px 0 5px rgba(0,0,0,0.05)' }}>
        <Sidebar />
      </Sider>
      <Layout>
        <Content
          style={{
            padding: '32px 40px',
            backgroundColor: '#f5f5f5',
            minHeight: '100vh',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: 24,
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;