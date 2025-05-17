import { Routes, Route } from 'react-router-dom';
import Landing from './pages/landing/Landing';
import Camera from './pages/camera/CameraPage';
import Analyze from './pages/analyze/AnalyzePage';
import Search from './pages/search/SearchPage';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/camera" element={<Camera />} />
      <Route path="/analyze" element={<Analyze />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}

export default AppRoutes;