import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { ConfigProvider, App as AntdApp } from 'antd'; // 여기서 App 이름 바꿔줘야 충돌 안 남
import 'antd/dist/reset.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider getPopupContainer={() => document.body}>
      <AntdApp> {/* ← 요거 없으면 스타일 안 먹음 */}
        <App />
      </AntdApp>
    </ConfigProvider>
  </React.StrictMode>
);