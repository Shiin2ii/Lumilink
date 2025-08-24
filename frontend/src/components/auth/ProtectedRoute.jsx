/**
 * =============================================================================
 * PROTECTED ROUTE COMPONENT - MCP SEQUENTIAL THINKING
 * =============================================================================
 * Route protection with authentication and authorization checks
 */

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const location = useLocation();

  // Step 1: Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Step 2: Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Step 3: Check admin requirements
  if (requireAdmin) {
    const isAdmin = user?.email === 'admin@lumilink.vn' || user?.email === 'admin@gmail.com' || user?.role === 'admin';

    if (!isAdmin) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
