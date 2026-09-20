const DEFAULT_API_BASE_URL = "https://rasoi-backend1.onrender.com";
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");


export function getImageUrl(image) {
	if (!image) return "https://placehold.co/600x400/fef3c7/9a3412?text=Rasoi";

	const value = String(image).trim();
	if (/^(https?:|data:|blob:)/i.test(value)) return value;

	const normalizedPath = value.replace(/^\/+/, "");
	const uploadPath = normalizedPath.startsWith("uploads/")
		? normalizedPath
		: `uploads/${normalizedPath}`;

	return `${API_BASE_URL}/${uploadPath}`;
}
