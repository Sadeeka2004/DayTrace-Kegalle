export const PROJECT_REFERENCE_POINT = {
  latitude: 7.1721806,
  longitude: 80.4526413,
};

const EARTH_RADIUS_KM = 6371;

const convertDegreesToRadians = (degrees) =>
  degrees * (Math.PI / 180);

export const calculateDistanceFromReferenceKm = (
  latitude,
  longitude,
) => {
  const latitudeDifference = convertDegreesToRadians(
    latitude - PROJECT_REFERENCE_POINT.latitude,
  );

  const longitudeDifference = convertDegreesToRadians(
    longitude - PROJECT_REFERENCE_POINT.longitude,
  );

  const referenceLatitude = convertDegreesToRadians(
    PROJECT_REFERENCE_POINT.latitude,
  );

  const attractionLatitude =
    convertDegreesToRadians(latitude);

  const haversineValue =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(referenceLatitude) *
      Math.cos(attractionLatitude) *
      Math.sin(longitudeDifference / 2) ** 2;

  const angularDistance =
    2 *
    Math.atan2(
      Math.sqrt(haversineValue),
      Math.sqrt(1 - haversineValue),
    );

  return EARTH_RADIUS_KM * angularDistance;
};