import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useLocation } from "react-router";

function PageScrollManager() {
  const { pathname } = useLocation();
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-5 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-slate-950/90 text-white shadow-2xl shadow-slate-950/25 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-500/25 motion-reduce:transition-none sm:bottom-7 sm:right-7 ${
        showBackToTop
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      aria-label="Back to top"
      tabIndex={showBackToTop ? 0 : -1}
    >
      <ArrowUp size={21} aria-hidden="true" />
    </button>
  );
}

export default PageScrollManager;