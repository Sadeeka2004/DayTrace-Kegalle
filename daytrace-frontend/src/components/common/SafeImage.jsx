import defaultFallbackImage from "../../assets/images/place-mountain-placeholder.png";

function SafeImage({
  src,
  alt = "",
  fallbackSrc = defaultFallbackImage,
  onError,
  ...imageProps
}) {
  const handleImageError = (event) => {
    const imageElement = event.currentTarget;

    if (imageElement.dataset.fallbackApplied === "true") {
      return;
    }

    imageElement.dataset.fallbackApplied = "true";
    imageElement.src = fallbackSrc;

    onError?.(event);
  };

  return (
    <img
      key={src}
      src={src || fallbackSrc}
      alt={alt}
      onError={handleImageError}
      {...imageProps}
    />
  );
}

export default SafeImage;