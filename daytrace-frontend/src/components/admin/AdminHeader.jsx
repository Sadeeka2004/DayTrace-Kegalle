import {
  ExternalLink,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Plus,
  UserRound,
} from "lucide-react";
import { Link, NavLink } from "react-router";
import useAdminAuth from "../../hooks/useAdminAuth";
import DayTraceLogo from "../brand/DayTraceLogo";

function AdminHeader({ title, description }) {
  const { admin, logout } = useAdminAuth();

  const getNavigationClasses = ({ isActive }) => {
    const commonClasses =
      "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition focus:outline-none focus:ring-4 focus:ring-teal-400/20";

    return isActive
      ? `${commonClasses} bg-teal-400 text-slate-950 shadow-lg shadow-teal-950/30`
      : `${commonClasses} text-slate-300 hover:bg-white/10 hover:text-white`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/95 px-4 py-3 text-white shadow-xl shadow-slate-950/10 backdrop-blur-xl sm:px-6">
      <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-4">
          <Link
            to="/admin"
            className="group flex shrink-0 items-center gap-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-400/20"
            aria-label="DayTrace Admin Dashboard"
          >
            <DayTraceLogo
  appearance="light"
  subtitle="Administration"
  className="[&>span]:hidden sm:[&>span]:block"
/>
          </Link>

          <span
            className="hidden h-9 w-px bg-white/15 xl:block"
            aria-hidden="true"
          />

          <div className="hidden min-w-0 xl:block">
            <p className="truncate font-bold">{title}</p>

            <p className="truncate text-xs text-slate-400">
              {description}
            </p>
          </div>
        </div>

        <nav
          aria-label="Administrator navigation"
          className="order-3 flex w-full items-center gap-1 overflow-x-auto border-t border-white/10 pt-3 lg:order-none lg:w-auto lg:border-0 lg:pt-0"
        >
          <NavLink
            to="/admin"
            end
            className={getNavigationClasses}
          >
            <LayoutDashboard size={17} />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/attractions/new"
            className={getNavigationClasses}
          >
            <Plus size={17} />
            Add attraction
          </NavLink>

          <NavLink
            to="/admin/branding"
            className={getNavigationClasses}
          >
            <ImageIcon size={17} />
            Change logo
          </NavLink>

          <Link
            to="/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full px-4 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <ExternalLink size={16} />
            Public website
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-3 py-2 md:flex">
            <UserRound
              size={16}
              className="text-teal-300"
            />

            <span className="max-w-28 truncate text-sm font-semibold">
              {admin?.username || "Administrator"}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-rose-400/25 bg-rose-400/10 px-3 text-sm font-semibold text-rose-100 transition hover:border-rose-300 hover:bg-rose-400/20 sm:px-4"
          >
            <LogOut size={17} />

            <span className="hidden sm:inline">
              Logout
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
