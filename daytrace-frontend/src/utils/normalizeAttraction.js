import fallbackImage from "../assets/images/place-mountain-placeholder.png";

const createShortDescription = (description = "") => {
  if (description.length <= 160) {
    return description;
  }

  return `${description.slice(0, 157).trim()}...`;
};

export const normalizeAttraction = (attraction) => {
  const imageRecords = Array.isArray(attraction.images)
    ? attraction.images
    : [];

  const primaryImageRecord = imageRecords.find(
    (image) => typeof image === "object" && image.isPrimary,
  );

  const imageUrls = imageRecords
    .map((image) => (typeof image === "string" ? image : image.url))
    .filter(Boolean);

  const primaryImage =
    primaryImageRecord?.url || imageUrls[0] || fallbackImage;

  const orderedImages = [
    primaryImage,
    ...imageUrls.filter((imageUrl) => imageUrl !== primaryImage),
  ];

  const attractionId = attraction._id || attraction.id;

  return {
    id: attractionId,
    slug: attractionId,
    name: attraction.name,
    category: attraction.category,
    location:
      attraction.location?.name ||
      attraction.location?.address ||
      "Location unavailable",
    address: attraction.location?.address || "",
    distanceKm:
      typeof attraction.distanceFromReferenceKm === "number"
        ? attraction.distanceFromReferenceKm
        : null,
    shortDescription: createShortDescription(attraction.description),
    description: attraction.description || "",
    openingTime: attraction.openingHours?.openingTime || null,
    closingTime: attraction.openingHours?.closingTime || null,
    openingNote: attraction.openingHours?.note || "",
    facilities: attraction.facilities || [],
    travelTips: attraction.travelTips || [],
    travelInformation: attraction.travelInformation || "",
    latitude: attraction.location?.latitude ?? null,
    longitude: attraction.location?.longitude ?? null,
    primaryImage,
    images: orderedImages,
    imageIsPlaceholder: imageUrls.length === 0,
  };
};

export const normalizeAttractions = (attractions = []) => {
  return attractions.map(normalizeAttraction);
};