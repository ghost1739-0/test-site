const isLocalHost = typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
const backendApiUrl = "https://eticaret-backend-tvpe.onrender.com/api";
const localApiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_BASE = isLocalHost ? localApiUrl : backendApiUrl;

export async function request(path, options = {}) {
  const token = localStorage.getItem("architect_shop_token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    throw new Error(payload?.message || "Request failed.");
  }

  return payload;
}

export { API_BASE };
