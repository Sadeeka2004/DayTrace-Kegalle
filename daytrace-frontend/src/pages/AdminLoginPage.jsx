import { useState } from "react";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router";
import useAdminAuth from "../hooks/useAdminAuth";
import DayTraceLogo from "../components/brand/DayTraceLogo";

function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isAuthenticated,
    isCheckingAuth,
  } = useAdminAuth();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const destination = location.state?.from || "/admin";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.username.trim() || !formData.password) {
      setErrorMessage("Username and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await login(formData);
      navigate(destination, { replace: true });
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isCheckingAuth && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-5 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.22),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(14,116,144,0.18),_transparent_42%)]" />

      <Link
        to="/"
        className="absolute left-5 top-5 z-10 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-white/15 sm:left-8 sm:top-8"
      >
        <ArrowLeft size={17} />
        Return to website
      </Link>

      <section className="relative z-10 w-full max-w-md rounded-[2rem] border border-white/10 bg-white p-7 shadow-2xl sm:p-10">
        <DayTraceLogo size="large" />

        <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-teal-700">
          Secure administration
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-950">
          Admin Login
        </h1>

        <p className="mt-3 leading-7 text-slate-600">
          Sign in using the predefined DayTrace administrator account.
        </p>

        {errorMessage && (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700"
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label
              htmlFor="admin-username"
              className="text-sm font-semibold text-slate-700"
            >
              Username
            </label>

            <div className="relative mt-2">
              <User
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="admin-username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                autoComplete="username"
                className="min-h-13 w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-4 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                placeholder="Enter Admin username"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                id="admin-password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                autoComplete="current-password"
                className="min-h-13 w-full rounded-2xl border border-slate-300 bg-slate-50 py-3 pl-12 pr-12 outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                placeholder="Enter Admin password"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((currentValue) => !currentValue)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-teal-700"
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
              >
                {showPassword ? (
                  <EyeOff size={19} />
                ) : (
                  <Eye size={19} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-13 w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-6 font-bold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <LoaderCircle size={19} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <ShieldCheck size={19} />
                Sign in securely
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          This area is restricted to the authorized system administrator.
        </p>
      </section>
    </main>
  );
}

export default AdminLoginPage;