import { LoaderCircle } from "lucide-react";
import { Navigate, useLocation } from "react-router";
import useAdminAuth from "../../hooks/useAdminAuth";

function ProtectedAdminRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isCheckingAuth } = useAdminAuth();

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center text-white">
          <LoaderCircle
            size={42}
            className="mx-auto animate-spin text-teal-400"
          />
          <p className="mt-4 font-medium">
            Checking administrator session...
          </p>
        </div>
      </main>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedAdminRoute;