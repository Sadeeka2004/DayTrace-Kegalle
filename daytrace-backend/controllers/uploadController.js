import { deleteStoredImages } from "../utils/imageStorage.js";

export const uploadImages = (request, response) => {
  if (!request.files || request.files.length === 0) {
    return response.status(400).json({
      success: false,
      message: "Please select at least one image",
    });
  }

  const serverUrl =
    `${request.protocol}://${request.get("host")}`;

  const images = request.files.map((file, index) => ({
    url: `${serverUrl}/uploads/attractions/${file.filename}`,
    altText: "",
    isPrimary: index === 0,
  }));

  response.status(201).json({
    success: true,
    message: `${images.length} image(s) uploaded successfully`,
    images,
  });
};

export const deleteUploadedImages = async (
  request,
  response,
  next,
) => {
  try {
    const { images } = request.body;

    if (!Array.isArray(images) || images.length === 0) {
      return response.status(400).json({
        success: false,
        message: "At least one uploaded image is required",
      });
    }

    if (images.length > 10) {
      return response.status(400).json({
        success: false,
        message:
          "A maximum of 10 images can be removed at once",
      });
    }

    const validImages = images.filter(
      (image) =>
        image &&
        typeof image === "object" &&
        typeof image.url === "string" &&
        image.url.trim(),
    );

    if (validImages.length !== images.length) {
      return response.status(400).json({
        success: false,
        message: "Every image must contain a valid URL",
      });
    }

    await deleteStoredImages(validImages);

    response.status(200).json({
      success: true,
      message:
        "Unused uploaded images removed successfully",
    });
  } catch (error) {
    next(error);
  }
};