import axios from "axios";

const DEFAULT_API_BASE_URL = "https://rasoi-backend1.onrender.com";
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

export function getImageUrl(image, fallback = "") {
  if (!image) return fallback;

  const value = String(image).trim();
  if (!value) return fallback;

  if (/^(https?:|data:|blob:)/i.test(value)) return value;

  const normalizedPath = value.replace(/^\/+/, "");
  const safePath = normalizedPath.replace(/\s+/g, "%20");

  if (safePath.startsWith("uploads/")) {
    return `${API_BASE_URL}/${safePath}`;
  }

  if (safePath.startsWith("api/")) {
    return `${API_BASE_URL}/${safePath}`;
  }

  return `${API_BASE_URL}/uploads/${safePath}`;
}

export function withFallbackImage(image) {
  return getImageUrl(image);
}

export async function getRecipes() {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/getall`);
    return response.data.data || [];
  } catch (firstError) {
    if (firstError.response?.status !== 500) throw firstError;

    await new Promise((resolve) => window.setTimeout(resolve, 800));
    const response = await axios.get(`${API_BASE_URL}/api/getall`);
    return response.data.data || [];
  }
}
