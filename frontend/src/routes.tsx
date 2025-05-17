import { Routes, Route } from 'react-router-dom';
import Landing from './pages/landing/Landing';
import Camera from './pages/camera/Camera';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/camera" element={<Camera />} />
    </Routes>
  );
}

export default AppRoutes;