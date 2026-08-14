import { Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import UserLayout from './layout/UserLayout';
import AdminLayout from './layout/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

import UserHome from './pages/UserHome';
import UserLegalitySekolah from './pages/UserLegalitySekolah';
import UserLegalityAlumni from './pages/UserLegalityAlumni';
import UserLegalityRandom from './pages/UserLegalityRandom';
import KitLegality from './pages/KitLegality';
import TemplateForm from './pages/TemplateForm';
import TDSChart from './pages/TDSChart';

import AdminDashboard from './pages/AdminDashboard';
import AdminSchools from './pages/AdminSchools';
import AdminAlumni from './pages/AdminAlumni';
import AdminSchoolProgram from './pages/AdminSchoolProgram';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* User portal — public, no login required */}
      <Route path="/" element={<UserLayout />}>
        <Route index element={<UserHome />} />
        <Route path="legality/sekolah" element={<UserLegalitySekolah />} />
        <Route path="legality/alumni" element={<UserLegalityAlumni />} />
        <Route path="legality/random" element={<UserLegalityRandom />} />
        <Route path="kit-legality" element={<KitLegality />} />
        <Route path="template-form" element={<TemplateForm />} />
        <Route path="tds-chart" element={<TDSChart />} />
      </Route>

      {/* Admin portal */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute requireRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="legality/schools" element={<AdminSchools />} />
        <Route path="legality/alumni" element={<AdminAlumni />} />
        <Route path="school-program" element={<AdminSchoolProgram />} />
      </Route>
    </Routes>
  );
}
