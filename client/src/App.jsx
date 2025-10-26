// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './layouts/ProtectedRoute';

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
import NotFoundPage from './pages/NotFoundPage';
import ProfileBuilder from './pages/profile/ProfileBuilder';
import EditProfile from './pages/profile/EditProfile';

function AppContent() {
  const { currentUser, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-green-400 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={!currentUser ? <LandingPage /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!currentUser ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!currentUser ? <SignUpPage /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={!currentUser ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />} />
      <Route path="/reset-password" element={!currentUser ? <ResetPasswordPage /> : <Navigate to="/dashboard" />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/profile-builder" element={<ProfileBuilderPage />} />
        <Route path="/profile/setup" element={<ProfileBuilder />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route 
          path="/dashboard" 
          element={<DashboardLayout />}
        >
          <Route index element={<DashboardHomePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="discover" element={<DiscoverPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="support" element={<SupportPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default function App() {
  return (
    <>
      {/* Router should be mounted once at the app root (e.g. main.jsx). */}
      {/* App renders routes without wrapping another <BrowserRouter>. */}
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </>
  );
}
