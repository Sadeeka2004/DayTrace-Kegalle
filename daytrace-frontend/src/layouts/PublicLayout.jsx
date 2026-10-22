import { Outlet, useLocation } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageScrollManager from "../components/ui/PageScrollManager";

function PublicLayout() {
  const { pathname } = useLocation();
  const overlayPaths = ["/", "/places", "/map", "/day-plan"];
  const normalizedPath =
    pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  const isHome = overlayPaths.includes(normalizedPath);

  return (
    <div
      className={`flex min-h-screen flex-col ${
        isHome ? "bg-slate-950" : "bg-[#f4f8f7]"
      }`}
    >
      <PageScrollManager />
      <Navbar overlay={isHome} />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default PublicLayout;