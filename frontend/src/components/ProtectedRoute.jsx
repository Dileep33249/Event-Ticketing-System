import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role: requiredRole, roles: allowedRoles }) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  
  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/Login" replace />;
  }
  
  // Check for specific role
  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/HomePage" replace />;
  }
  
  // Check for multiple allowed roles
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/HomePage" replace />;
  }
  
  return children;
};

export default ProtectedRoute;


