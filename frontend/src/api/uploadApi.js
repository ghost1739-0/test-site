import { API_BASE } from "./client";

export async function uploadProductImage(file) {
  const token = localStorage.getItem("architect_shop_token");
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload?.message || "Image upload failed.");
  }

  return payload;
}
