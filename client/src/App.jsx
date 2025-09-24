// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import SignUpPage from './pages/auth/SignUpPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfileBuilderPage from './pages/auth/ProfileBuilderPage';
import DashboardHomePage from './pages/dashboard/DashboardHomePage';
import ProjectsPage from './pages/dashboard/ProjectsPage';
import ProjectDetailPage from './pages/dashboard/ProjectDetailPage';
import DiscoverPage from './pages/dashboard/DiscoverPage';
import ChatPage from './pages/dashboard/ChatPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import SupportPage from './pages/dashboard/SupportPage';

// Simple spinner while checking auth
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-900">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
  </div>
);

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth pages (redirect if already logged in) */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <AuthRoute>
                <LoginPage />
              </AuthRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthRoute>
                <SignUpPage />
              </AuthRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <AuthRoute>
                <ForgotPasswordPage />
              </AuthRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <AuthRoute>
                <ResetPasswordPage />
              </AuthRoute>
            }
          />
        </Route>

        {/* Profile builder (after signup, before dashboard) */}
        <Route
          path="/profile-builder"
          element={
            <ProtectedRoute>
              <ProfileBuilderPage />
            </ProtectedRoute>
          }
        />

        {/* Dashboard and sub-pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
