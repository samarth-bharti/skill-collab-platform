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
import NotFoundPage from './pages/NotFoundPage';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="text-green-400 text-lg animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={!user ? <LandingPage /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
      <Route path="/signup" element={!user ? <SignUpPage /> : <Navigate to="/dashboard" />} />
      <Route path="/forgot-password" element={!user ? <ForgotPasswordPage /> : <Navigate to="/dashboard" />} />
      <Route path="/reset-password" element={!user ? <ResetPasswordPage /> : <Navigate to="/dashboard" />} />
      
      {/* Profile Builder */}
      <Route path="/profile-builder" element={user ? <ProfileBuilderPage /> : <Navigate to="/login" />} />

      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={user ? <DashboardLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<DashboardHomePage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:id" element={<ProjectDetailPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="discover" element={<DiscoverPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="support" element={<SupportPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
