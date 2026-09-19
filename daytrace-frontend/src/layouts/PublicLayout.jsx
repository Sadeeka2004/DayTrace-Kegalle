import { Outlet } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import PageScrollManager from "../components/ui/PageScrollManager";

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <PageScrollManager />
      <Navbar />

      <div className="flex-1">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default PublicLayout;