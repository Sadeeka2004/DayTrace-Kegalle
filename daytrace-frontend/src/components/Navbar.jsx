import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, ShieldCheck, X } from "lucide-react";
import useDayPlan from "../hooks/useDayPlan";
import DayTraceLogo from "./brand/DayTraceLogo";

const navigationLinks = [
  { label: "Home", path: "/" },
  { label: "Explore", path: "/places" },
  { label: "Map", path: "/map" },
  { label: "My Day Plan", path: "/day-plan" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { planAttractionIds } = useDayPlan();

  const planCount = planAttractionIds.length;

  const closeMobileMenu = () => {
    setIsMenuOpen(false);
  };

  const getDesktopLinkClasses = ({ isActive }) => {
    const commonClasses =
      "inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition duration-200 focus:outline-none focus:ring-4 focus:ring-teal-600/15";

    return isActive
      ? `${commonClasses} bg-slate-950 text-white shadow-lg shadow-slate-950/15`
      : `${commonClasses} text-slate-600 hover:bg-teal-50 hover:text-teal-800`;
  };

  const getMobileLinkClasses = ({ isActive }) => {
    const commonClasses =
      "flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold transition";

    return isActive
      ? `${commonClasses} bg-slate-950 text-white shadow-lg`
      : `${commonClasses} text-slate-700 hover:bg-teal-50 hover:text-teal-800`;
  };

  const renderPlanCount = (isMobile = false) => {
    if (planCount === 0) {
      return null;
    }

    return (
      <span
        className={`inline-flex min-h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-xs font-bold ${
          isMobile
            ? "bg-teal-500 text-slate-950"
            : "bg-teal-400 text-slate-950"
        }`}
        aria-label={`${planCount} ${
          planCount === 1 ? "attraction" : "attractions"
        } in your day plan`}
      >
        {planCount}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-50 px-3 py-3 sm:px-5">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex h-16 max-w-7xl items-center justify-between rounded-2xl border border-white/70 bg-white/80 px-4 shadow-xl shadow-slate-950/10 backdrop-blur-2xl sm:px-5"
      >
        <Link
  to="/"
  onClick={closeMobileMenu}
  className="group flex items-center gap-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-600/15"
  aria-label="DayTrace Kegalle home"
>
  <DayTraceLogo />
</Link>

        <div className="hidden items-center gap-1 md:flex">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={getDesktopLinkClasses}
            >
              <span>{link.label}</span>

              {link.path === "/day-plan" && renderPlanCount()}
            </NavLink>
          ))}

          <span
            className="mx-2 h-7 w-px bg-slate-200"
            aria-hidden="true"
          />

          <Link
            to="/admin/login"
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-4 text-sm font-semibold text-slate-700 transition hover:border-teal-600 hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-600/15"
          >
            <ShieldCheck size={17} />
            Admin
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setIsMenuOpen((currentState) => !currentState)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white/70 text-slate-700 transition hover:border-teal-600 hover:bg-teal-50 hover:text-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-600/15 md:hidden"
          aria-label={
            isMenuOpen
              ? "Close navigation menu"
              : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/70 bg-white/90 p-3 shadow-2xl shadow-slate-950/15 backdrop-blur-2xl md:hidden"
        >
          <div className="space-y-2">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.path === "/"}
                onClick={closeMobileMenu}
                className={getMobileLinkClasses}
              >
                <span>{link.label}</span>

                {link.path === "/day-plan" &&
                  renderPlanCount(true)}
              </NavLink>
            ))}

            <Link
              to="/admin/login"
              onClick={closeMobileMenu}
              className="flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 font-semibold text-slate-700 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800"
            >
              <ShieldCheck size={19} />
              Admin Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;