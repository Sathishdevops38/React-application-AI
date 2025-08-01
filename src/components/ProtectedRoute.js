import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show a loading indicator while the auth state is being checked on initial load.
  if (loading) {
    return <div>Loading session...</div>;
  }

  if (!user) {
    // If the user is not authenticated, redirect them to the login page.
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;