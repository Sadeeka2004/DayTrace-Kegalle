const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const apiRequest = async (endpoint, options = {}) => {
  const requestHeaders = {
    ...options.headers,
  };

  if (options.body && !(options.body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: requestHeaders,
  });

  const responseData = await response.json().catch(() => ({
    success: false,
    message: "The server returned an invalid response",
  }));

  if (!response.ok) {
    const validationDetails = responseData.errors?.join(", ");
    const errorMessage = validationDetails
      ? `${responseData.message}: ${validationDetails}`
      : responseData.message || "API request failed";

    const apiError = new Error(errorMessage);
apiError.status = response.status;

throw apiError;
  }

  return responseData;
};

const createAuthHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
});

export const getAttractions = async ({
  search = "",
  category = "",
} = {}) => {
  const queryParameters = new URLSearchParams();

  if (search.trim()) {
    queryParameters.set("search", search.trim());
  }

  if (category.trim()) {
    queryParameters.set("category", category.trim());
  }

  const queryString = queryParameters.toString();
  const endpoint = queryString
    ? `/attractions?${queryString}`
    : "/attractions";

  return apiRequest(endpoint);
};

export const getAttractionById = async (attractionId) => {
  return apiRequest(`/attractions/${attractionId}`);
};

export const getBranding = async () => {
  return apiRequest("/branding");
};

export const updateBrandingLogoUrl = async (logoUrl, token) => {
  return apiRequest("/branding/logo-url", {
    method: "PATCH",
    headers: createAuthHeaders(token),
    body: JSON.stringify({ logoUrl }),
  });
};

export const uploadBrandingLogo = async (logoFile, token) => {
  const formData = new FormData();
  formData.append("logo", logoFile);

  return apiRequest("/branding/logo-upload", {
    method: "POST",
    headers: createAuthHeaders(token),
    body: formData,
  });
};

export const resetBrandingLogo = async (token) => {
  return apiRequest("/branding/logo", {
    method: "DELETE",
    headers: createAuthHeaders(token),
  });
};

export const loginAdmin = async (credentials) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};

export const getCurrentAdmin = async (token) => {
  return apiRequest("/auth/me", {
    headers: createAuthHeaders(token),
  });
};

export const createAttraction = async (attractionData, token) => {
  return apiRequest("/attractions", {
    method: "POST",
    headers: createAuthHeaders(token),
    body: JSON.stringify(attractionData),
  });
};

export const updateAttraction = async (
  attractionId,
  attractionData,
  token,
) => {
  return apiRequest(`/attractions/${attractionId}`, {
    method: "PATCH",
    headers: createAuthHeaders(token),
    body: JSON.stringify(attractionData),
  });
};

export const deleteAttraction = async (attractionId, token) => {
  return apiRequest(`/attractions/${attractionId}`, {
    method: "DELETE",
    headers: createAuthHeaders(token),
  });
};

export const uploadAttractionImages = async (imageFiles, token) => {
  const formData = new FormData();

  imageFiles.forEach((imageFile) => {
    formData.append("images", imageFile);
  });

  return apiRequest("/uploads/attractions", {
    method: "POST",
    headers: createAuthHeaders(token),
    body: formData,
  });
};

export const deleteUploadedAttractionImages = async (
  images,
  token,
) => {
  return apiRequest("/uploads/attractions", {
    method: "DELETE",
    headers: createAuthHeaders(token),
    body: JSON.stringify({ images }),
  });
};