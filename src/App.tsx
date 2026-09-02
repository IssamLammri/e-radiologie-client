/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { CasesCatalog } from './pages/CasesCatalog';
import { CaseDetail } from './pages/CaseDetail';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { ResetPassword } from './pages/ResetPassword';
import { AuthProvider, useAuth } from './contexts/AuthContext';

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
