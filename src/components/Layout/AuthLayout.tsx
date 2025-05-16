import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
      }}
    >
      <div
        style={{
          width: 400,
          background: '#fff',
          padding: 32,
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
