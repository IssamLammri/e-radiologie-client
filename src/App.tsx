/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { lazy } from 'react';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { CasesCatalog } from './pages/CasesCatalog';
import { CaseDetail } from './pages/CaseDetail';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { ResetPassword } from './pages/ResetPassword';
import './v1.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const Classifications = lazy(() => import('./pages/Classifications').then(module => ({ default: module.Classifications })));
const Academy = lazy(() => import('./pages/Academy').then(module => ({ default: module.Academy })));
const CourseDetail = lazy(() => import('./pages/CourseDetail').then(module => ({ default: module.CourseDetail })));
const DemsDetail = lazy(() => import('./pages/DemsDetail').then(module => ({ default: module.DemsDetail })));
const Reports = lazy(() => import('./pages/Reports').then(module => ({ default: module.Reports })));

function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return <Outlet />;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="classifications" element={<Classifications />} />
            <Route path="academy" element={<Academy />} />
            <Route path="academy/courses/:id" element={<CourseDetail />} />
            <Route path="academy/dems/:id" element={<DemsDetail />} />
            <Route path="reports" element={<Reports />} />
            
            <Route element={<ProtectedRoute />}>
              <Route path="cases" element={<CasesCatalog />} />
              <Route path="cases/:id" element={<CaseDetail />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
