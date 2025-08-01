import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Page Imports
import LoginPage from './pages/LoginPage';
import RegistrationPage from './pages/RegistrationPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import DashboardPage from './pages/DashboardPage';
import LogoutPage from './pages/LogoutPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes that redirect if the user is already logged in */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <RegistrationPage />} />

      {/* Public routes accessible to all users */}
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/logout" element={<LogoutPage />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
      />

      {/* Redirect root to the dashboard. ProtectedRoute will handle redirecting to /login if not authenticated. */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Fallback 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;