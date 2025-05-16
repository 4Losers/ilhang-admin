// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import MissionPage from './pages/MissionPage';
import MatchingPage from './pages/MatchingPage';
import CertificationPage from './pages/CertificationPage';
import ReportPage from './pages/ReportPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ✅ 로그인/회원가입은 누구나 접근 가능 */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* ✅ 관리자 영역: 로그인 안 하면 접근 불가 */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="missions" element={<MissionPage />} />
          <Route path="matchings" element={<MatchingPage />} />
          <Route path="certifications" element={<CertificationPage />} />
          <Route path="reports" element={<ReportPage />} />
          <Route path="admins" element={<AdminPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;