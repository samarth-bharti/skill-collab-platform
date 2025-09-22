// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';

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

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) {
        // You can replace this with a beautiful spinner component
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* --- Public Routes --- */}
                <Route path="/" element={<LandingPage />} />

                {/* --- Authentication Routes --- */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignUpPage />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>

                {/* --- Protected Routes --- */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* This is the main dashboard page at /dashboard */}
                    <Route index element={<DashboardHomePage />} />
                    
                    {/* Other dashboard pages */}
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="projects/:projectId" element={<ProjectDetailPage />} />
                    <Route path="discover" element={<DiscoverPage />} />
                    <Route path="chat" element={<ChatPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="support" element={<SupportPage />} />
                </Route>

                {/* This route is special because it's after signup but before the main dashboard */}
                 <Route 
                    path="/profile-builder" 
                    element={
                        <ProtectedRoute>
                           <ProfileBuilderPage />
                        </ProtectedRoute>
                    } 
                />

                {/* --- Catch-all for undefined routes --- */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </AuthProvider>
    );
}