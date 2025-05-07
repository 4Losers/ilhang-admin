import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  FlagOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SettingOutlined,
} from '@ant-design/icons';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const items = [
    { key: '/', icon: <DashboardOutlined />, label: '대시보드' },
    { key: '/users', icon: <UserOutlined />, label: '유저 관리' },
    { key: '/missions', icon: <FlagOutlined />, label: '미션 관리' },
    { key: '/matchings', icon: <TeamOutlined />, label: '매칭 관리' },
    { key: '/certifications', icon: <CheckCircleOutlined />, label: '인증 관리' },
    { key: '/reports', icon: <WarningOutlined />, label: '신고 관리' },
    { key: '/admins', icon: <SettingOutlined />, label: '운영자 관리' },
  ];

  return (
    <Menu
      mode="inline"
      selectedKeys={[location.pathname]}
      onClick={({ key }) => navigate(key)}
      items={items}
      style={{ height: '100%', borderRight: 0 }}
    />
  );
};

export default Sidebar;