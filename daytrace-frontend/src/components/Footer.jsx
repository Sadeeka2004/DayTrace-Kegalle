import {
  ExternalLink,
  Info,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router";
import DayTraceLogo from "./brand/DayTraceLogo";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-5 py-12 text-slate-300 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-white"
            aria-label="DayTrace Kegalle home"
          >
            <DayTraceLogo appearance="light" />
          </Link>

          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            Discover local attractions and organize a simple one-day visit
            within the approved project area around Wilpola, Aranayake.
          </p>
        </div>

        <div>
          <h2 className="font-bold text-white">Useful links</h2>

          <nav
            aria-label="Footer navigation"
            className="mt-4 space-y-3 text-sm"
          >
            <Link
              className="block transition hover:text-teal-300"
              to="/places"
            >
              Explore places
            </Link>

            <Link
              className="block transition hover:text-teal-300"
              to="/map"
            >
              Interactive map
            </Link>

            <Link
              className="block transition hover:text-teal-300"
              to="/day-plan"
            >
              My Day Plan
            </Link>

            <Link
              className="inline-flex items-center gap-2 transition hover:text-teal-300"
              to="/information-credits"
            >
              <Info size={16} />
              Information &amp; Credits
            </Link>
          </nav>
        </div>

        <div>
          <h2 className="font-bold text-white">Project notice</h2>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            This university project is not an official tourism, emergency,
            booking, payment or navigation service. Verify important travel
            information before visiting.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/admin/login"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-teal-400 hover:text-teal-300"
            >
              <ShieldCheck size={16} />
              Admin
            </Link>

            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:border-teal-400 hover:text-teal-300"
            >
              Map credits
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-2 border-t border-slate-800 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {currentYear} DayTrace Kegalle.</p>
        <p>Developed for the ITE2953 university project.</p>
      </div>
    </footer>
  );
}

export default Footer;