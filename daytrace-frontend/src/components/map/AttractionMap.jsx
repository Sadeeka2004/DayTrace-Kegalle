import { useEffect } from "react";
import { divIcon, latLngBounds } from "leaflet";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import { Link } from "react-router";
import {
  ArrowUpRight,
  Camera,
  MapPin,
} from "lucide-react";
import SafeImage from "../common/SafeImage";

const WILPOLA_REFERENCE_POINT = [7.1721806, 80.4526413];

function createAttractionIcon(isSelected) {
  return divIcon({
    className: "daytrace-marker-wrapper",
    html: `<span class="daytrace-marker ${
      isSelected ? "daytrace-marker-selected" : ""
    }"></span>`,
    iconSize: [42, 42],
    iconAnchor: [21, 40],
    popupAnchor: [0, -38],
  });
}

function MapController({
  selectedAttraction,
  routeCoordinates,
}) {
  const map = useMap();

  useEffect(() => {
    if (routeCoordinates.length > 1) {
      map.fitBounds(latLngBounds(routeCoordinates), {
        padding: [45, 45],
        maxZoom: 15,
      });

      return;
    }

    if (!selectedAttraction) {
      return;
    }

    map.flyTo(
      [
        selectedAttraction.latitude,
        selectedAttraction.longitude,
      ],
      14,
      {
        duration: 1.2,
      },
    );
  }, [map, routeCoordinates, selectedAttraction]);

  return null;
}

function AttractionMap({
  attractions,
  selectedAttraction,
  onAttractionSelect,
  onMapError,
  routeCoordinates = [],
  compact = false,
}) {
  const initialCenter = selectedAttraction
    ? [
        selectedAttraction.latitude,
        selectedAttraction.longitude,
      ]
    : WILPOLA_REFERENCE_POINT;

  return (
    <MapContainer
      center={initialCenter}
      zoom={selectedAttraction ? 14 : 11}
      scrollWheelZoom
      className={`h-full rounded-3xl ${
        compact ? "min-h-[380px]" : "min-h-[520px]"
      }`}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        eventHandlers={{
          tileerror: () => {
            onMapError?.(
              "OpenStreetMap tiles could not be loaded. Check your internet connection and try again.",
            );
          },
        }}
      />

      <Circle
        center={WILPOLA_REFERENCE_POINT}
        radius={25000}
        pathOptions={{
          color: "#0f766e",
          fillColor: "#14b8a6",
          fillOpacity: 0.04,
          weight: 2,
          dashArray: "7 8",
        }}
        interactive={false}
      />

      <CircleMarker
        center={WILPOLA_REFERENCE_POINT}
        radius={8}
        pathOptions={{
          color: "#ffffff",
          fillColor: "#0f172a",
          fillOpacity: 1,
          weight: 3,
        }}
      >
        <Popup>
          <div className="p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
              Project reference point
            </p>

            <p className="mt-2 font-bold text-slate-950">
              Wilpola, Aranayake
            </p>
          </div>
        </Popup>
      </CircleMarker>

      {routeCoordinates.length > 1 && (
        <>
          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "#ffffff",
              opacity: 0.92,
              weight: 10,
            }}
          />

          <Polyline
            positions={routeCoordinates}
            pathOptions={{
              color: "#f59e0b",
              opacity: 1,
              weight: 6,
            }}
          />
        </>
      )}

      {attractions.map((attraction) => {
        const isSelected =
          selectedAttraction?.id === attraction.id;

        return (
          <Marker
            key={attraction.id}
            position={[
              attraction.latitude,
              attraction.longitude,
            ]}
            icon={createAttractionIcon(isSelected)}
            eventHandlers={{
              click: () =>
                onAttractionSelect(attraction.id),
            }}
          >
            <Popup
              className="daytrace-place-popup"
              autoPan
              keepInView
              autoPanPaddingTopLeft={[24, 110]}
              autoPanPaddingBottomRight={[24, 24]}
            >
              <article className="w-[250px] overflow-hidden bg-white">
                <div className="relative h-28 overflow-hidden bg-slate-200">
                  <SafeImage
                    src={attraction.primaryImage}
                    alt={attraction.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                    loading="lazy"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-slate-950/10" />

                  <span className="absolute bottom-2.5 left-3 rounded-full bg-teal-400 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-950 shadow-lg">
                    {attraction.category}
                  </span>

                  <span className="absolute bottom-2.5 right-3 inline-flex items-center gap-1 rounded-full border border-white/20 bg-slate-950/70 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-md">
                    <Camera
                      size={13}
                      aria-hidden="true"
                    />

                    {attraction.images.length}
                  </span>
                </div>

                <div className="p-4">
                  <h2 className="text-base font-bold leading-6 text-slate-950">
                    {attraction.name}
                  </h2>

                  <p className="mt-2.5 flex items-start gap-2 text-sm text-slate-600">
                    <MapPin
                      size={16}
                      className="mt-0.5 shrink-0 text-teal-700"
                      aria-hidden="true"
                    />

                    <span>{attraction.location}</span>
                  </p>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {attraction.distanceKm !== null
                      ? `Approximately ${attraction.distanceKm} km from Wilpola.`
                      : "Approximate distance is currently unavailable."}
                  </p>

                  <Link
                    to={`/places/${attraction.id}`}
                    className="daytrace-popup-link mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-600 focus:outline-none focus:ring-4 focus:ring-teal-600/20"
                  >
                    View details

                    <ArrowUpRight
                      size={16}
                      aria-hidden="true"
                    />
                  </Link>
                </div>
              </article>
            </Popup>
          </Marker>
        );
      })}

      <MapController
        selectedAttraction={selectedAttraction}
        routeCoordinates={routeCoordinates}
      />
    </MapContainer>
  );
}

export default AttractionMap;