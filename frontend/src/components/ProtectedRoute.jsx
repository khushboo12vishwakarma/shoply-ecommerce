import { Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Wraps routes that require authentication. Pass `roles` to restrict
 * access to specific user roles (e.g. ["vendor", "admin"]).
 */
export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Logged in but wrong role → show access denied
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="card p-10 max-w-md w-full">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
          <p className="text-slate-500 mb-6">
            You don't have permission to view this page.
            {roles.includes("vendor") || roles.includes("admin")
              ? " This area is for vendors and admins only."
              : ""}
          </p>
          <Link to="/" className="btn-primary inline-block px-6 py-2">
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
