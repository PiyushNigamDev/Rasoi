export const API_BASE_URL = "http://localhost:5000";

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
