import { Route, Routes } from "react-router";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import PublicLayout from "./layouts/PublicLayout";
import AddAttractionPage from "./pages/AddAttractionPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import BrandingSettingsPage from "./pages/BrandingSettingsPage";
import DayPlanPage from "./pages/DayPlanPage";
import ExplorePlacesPage from "./pages/ExplorePlacesPage";
import HomePage from "./pages/HomePage";
import MapPage from "./pages/MapPage";
import PlaceDetailsPage from "./pages/PlaceDetailsPage";
import PlaceholderPage from "./pages/PlaceholderPage";
import ManageAttractionImagesPage from "./pages/ManageAttractionImagesPage";
import EditAttractionPage from "./pages/EditAttractionPage";
import InformationCreditsPage from "./pages/InformationCreditsPage";

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/places" element={<ExplorePlacesPage />} />
          <Route
            path="/places/:placeSlug"
            element={<PlaceDetailsPage />}
          />
          <Route path="/map" element={<MapPage />} />
          <Route path="/day-plan" element={<DayPlanPage />} />
          <Route path="/information-credits" element={<InformationCreditsPage />} />
        </Route>

        <Route
          path="/admin/login"
          element={<AdminLoginPage />}
        />

        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboardPage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/attractions/new"
          element={
            <ProtectedAdminRoute>
              <AddAttractionPage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/branding"
          element={
            <ProtectedAdminRoute>
              <BrandingSettingsPage />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/attractions/:attractionId/images"
          element={
           <ProtectedAdminRoute>
             <ManageAttractionImagesPage />
           </ProtectedAdminRoute>
          }
        />

        <Route
  path="/admin/attractions/:attractionId/edit"
  element={
    <ProtectedAdminRoute>
      <EditAttractionPage />
    </ProtectedAdminRoute>
  }
/>

        <Route
          path="*"
          element={
            <PlaceholderPage
              label="404 Error"
              title="Page Not Found"
              description="The page you requested does not exist."
            />
          }
        />
      </Routes>
    </AdminAuthProvider>
  );
}

export default App;
