import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { RoleBasedRoute } from './auth/RoleBasedRoute';
import Layout from './components/layout/Layout';
import { Role } from './types';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OwnerSignupPage from './pages/auth/OwnerSignupPage';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsersList from './pages/admin/AdminUsersList';
import AdminAddUser from './pages/admin/AdminAddUser';
import AdminStoresList from './pages/admin/AdminStoresList';
import AdminAddStore from './pages/admin/AdminAddStore';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminStoreDetail from './pages/admin/AdminStoreDetail';

// Shared pages (all authenticated users)
import ProfilePage from './pages/shared/ProfilePage';
import ChangePasswordPage from './pages/user/ChangePasswordPage';

// User pages
import UserStoresList from './pages/user/UserStoresList';

// Store owner pages
import StoreOwnerDashboard from './pages/owner/StoreOwnerDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/signup/owner" element={<OwnerSignupPage />} />

          {/* Admin routes */}
          <Route
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={[Role.ADMIN]}>
                  <Layout />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersList />} />
            <Route path="/admin/users/add" element={<AdminAddUser />} />
            <Route path="/admin/users/:id" element={<AdminUserDetail />} />
            <Route path="/admin/stores" element={<AdminStoresList />} />
            <Route path="/admin/stores/add" element={<AdminAddStore />} />
            <Route path="/admin/stores/:id" element={<AdminStoreDetail />} />
          </Route>

          {/* Normal user routes */}
          <Route
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={[Role.NORMAL_USER]}>
                  <Layout />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          >
            <Route path="/user" element={<UserStoresList />} />
          </Route>

          {/* Store owner routes */}
          <Route
            element={
              <ProtectedRoute>
                <RoleBasedRoute allowedRoles={[Role.STORE_OWNER]}>
                  <Layout />
                </RoleBasedRoute>
              </ProtectedRoute>
            }
          >
            <Route path="/owner" element={<StoreOwnerDashboard />} />
          </Route>

          {/* Shared authenticated routes */}
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/change-password" element={<ChangePasswordPage />} />
          </Route>

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
