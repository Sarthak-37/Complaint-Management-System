import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RoleGuard from "./auth/RoleGuard";
import ToastProvider from "./components/ToastProvider";
import AuthLayout from "./components/auth/AuthLayout";
import Footer from "./components/Footer";

import AdminDashboard from "./pages/admin/Dashboard";
import AuthorityDashboard from "./pages/authority/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import UserManagement from "./pages/admin/UserManagement";
import AdminLayout from "./layouts/AdminLayout";
import AuthorityLayout from "./layouts/AuhtorityLayout";
import UserLayout from "./layouts/UserLayout";
import AcceptInvite from "./pages/AcceptInvite";
import CreateComplaint from "./pages/createComplaint";
import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminAnalytics from "./pages/admin/analytics/AdminAnalytics";
import VerifyEmail from "./pages/VerifyEmail";
function App() {
  return (
    <BrowserRouter>
      <ToastProvider/>
      <Routes>
        {/* ✅ NEW: Auth Routes using new AuthLayout */}
        <Route path="/auth" element={<AuthLayout />} />
        
        {/* ✅ Redirect old routes to new auth layout */}
        <Route path="/login" element={<Navigate to="/auth" replace />} />
        <Route path="/register" element={<Navigate to="/auth" replace />} />

        {/* Public Routes */}
        <Route path="/user/complaints/new" element={<CreateComplaint />} />
        <Route path="/accept-invite" element={<AcceptInvite />} />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* Redirect root to auth */}
        <Route path="/" element={<Navigate to="/auth" replace />} />

        {/* Admin Routes */}
        <Route element={<RoleGuard allowedRoles={["ADMIN"]} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/complaints" element={<AdminComplaints />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
          </Route>
        </Route>

        {/* Authority Routes */}
        <Route element={<RoleGuard allowedRoles={["AUTHORITY"]} />}>
          <Route element={<AuthorityLayout />}>
            <Route path="/authority/dashboard" element={<AuthorityDashboard />} />
          </Route>
        </Route>

        {/* User Routes */}
        <Route element={<RoleGuard allowedRoles={["USER"]} />}>
          <Route element={<UserLayout />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>
        </Route>

        {/* Unauthorized */}
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
                <p className="text-gray-600 mb-4">Unauthorized Access</p>
                <a 
                  href="/auth" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Return to Login
                </a>
              </div>
            </div>
          }
        />

        {/* 404 Not Found */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 mb-4">Page Not Found</p>
                <a 
                  href="/auth" 
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Return to Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;