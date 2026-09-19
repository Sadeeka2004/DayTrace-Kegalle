import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import BrandingProvider from "./context/BrandingProvider";
import DayPlanProvider from "./context/DayPlanProvider";
import FavoriteProvider from "./context/FavoriteProvider";
import "./index.css";
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BrandingProvider>
        <DayPlanProvider>
          <FavoriteProvider>
            <App />
          </FavoriteProvider>
        </DayPlanProvider>
      </BrandingProvider>
    </BrowserRouter>
  </StrictMode>,
);

