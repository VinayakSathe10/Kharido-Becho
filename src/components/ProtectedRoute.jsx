/**
 * ProtectedRoute Component
 * 
 * Controls access to routes based on authentication and role requirements.
 * 
 * Behavior:
 * - If `requiredRole` is null: route is accessible to any authenticated user
 * - If `requiredRole` is "BUYER": only buyers can access
 * - If `requiredRole` is "SELLER": only sellers can access
 * - If user is not authenticated: redirects to login
 * - If user doesn't have required role: redirects to home
 */

import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function ProtectedRoute({ children, requiredRole = null }) {
  const { isSignedIn, isLoading, roles } = useAuth();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return <LoadingScreen />;
  }

  // If not authenticated, redirect to login
  if (!isSignedIn) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, check if user has it
  if (requiredRole) {
    const hasRole = roles.includes(requiredRole);
    if (!hasRole) {
      // User doesn't have required role, redirect to home
      return <Navigate to="/" replace />;
    }
  }

  // User is authenticated and has required role (if any), render children
  return children;
}

