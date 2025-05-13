import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';

import DashboardPage from './pages/DashboardPage';
import UserPage from './pages/UserPage';
import MissionPage from './pages/MissionPage';
import MatchingPage from './pages/MatchingPage';
import CertificationPage from './pages/CertificationPage';
import ReportPage from './pages/ReportPage';
import AdminPage from './pages/AdminPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
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