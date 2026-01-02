import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

interface RoleGuardProps {
  allowedRoles?: string[];
}

const RoleGuard = ({ allowedRoles }: RoleGuardProps) => {
  const { user } = useAuth();

  // 🔴 Not logged in - Redirect to new auth route
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // 🔴 Logged in but role not allowed
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 🟢 Authorized
  return <Outlet />;
};

export default RoleGuard;