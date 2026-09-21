const DEFAULT_OSRM_BASE_URL = "https://router.project-osrm.org";

function isValidPoint(point) {
  return (
    Number.isFinite(point?.latitude) &&
    Number.isFinite(point?.longitude)
  );
}

export async function getDrivingRoute(points) {
  if (!Array.isArray(points) || points.length < 2) {
    throw new Error("Select a valid start point and destination.");
  }

  if (!points.every(isValidPoint)) {
    throw new Error("One or more selected locations have invalid coordinates.");
  }

  const coordinatePath = points
    .map((point) => `${point.longitude},${point.latitude}`)
    .join(";");

  const baseUrl = (
    import.meta.env.VITE_OSRM_BASE_URL || DEFAULT_OSRM_BASE_URL
  ).replace(/\/$/, "");

  const requestUrl =
    `${baseUrl}/route/v1/driving/${coordinatePath}` +
    "?overview=full&geometries=geojson&steps=false";

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(requestUrl, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error("The route service could not calculate this journey.");
    }

    const data = await response.json();
    const route = data.routes?.[0];

    if (data.code !== "Ok" || !route?.geometry?.coordinates) {
      throw new Error("No road route was found between these locations.");
    }

    return {
      coordinates: route.geometry.coordinates.map(
        ([longitude, latitude]) => [latitude, longitude],
      ),
      distanceKm: route.distance / 1000,
      durationMinutes: route.duration / 60,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(
        "The route request took too long. Check your internet connection and try again.",
        { cause: error },
      );
    }

    if (error instanceof TypeError) {
      throw new Error(
        "The route service is unavailable. Check your internet connection and try again.",
        { cause: error },
      );
    }

    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}