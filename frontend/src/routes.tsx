import { Routes, Route } from 'react-router-dom';
import Landing from './pages/landing/Landing';
import Camera from './pages/camera/CameraPage';
import Analyze from './pages/analyze/AnalyzePage';
import Search from './pages/search/SearchPage';
import Compare from './pages/compare/ComparePage';
import Results1 from './pages/results1/Result1Page';
import Results2 from './pages/results2/Result2Page';
import AdminPage from './pages/admin/admin';
import NoMatchPage from './pages/no-match/no-match';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/camera" element={<Camera />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/search" element={<Search />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/no-match" element={<NoMatchPage />} />
    </Routes>
  );
}

export default AppRoutes;