import { request } from "./client";

export function createOrder(payload) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function fetchMyOrders() {
  return request("/orders/mine");
}

export function fetchOrderById(id) {
  return request(`/orders/${id}`);
}

export function requestCancelOrder(id, reason) {
  return request(`/orders/${id}/cancel-request`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function requestReturnOrder(id, reason) {
  return request(`/orders/${id}/return-request`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export function fetchAllOrdersAdmin() {
  return request("/orders/admin/all");
}

export function updateTrackingAdmin(id, payload) {
  return request(`/orders/${id}/tracking`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function approveCancelAdmin(id) {
  return request(`/orders/${id}/cancel-approve`, {
    method: "PUT",
  });
}

export function approveReturnAdmin(id) {
  return request(`/orders/${id}/return-approve`, {
    method: "PUT",
  });
}

export function rejectReturnAdmin(id, reason) {
  return request(`/orders/${id}/return-reject`, {
    method: "PUT",
    body: JSON.stringify({ reason }),
  }).catch(async (error) => {
    const message = String(error?.message || "");

    if (!message.includes("Not Found") || !message.includes("return-reject")) {
      throw error;
    }

    const token = localStorage.getItem("architect_shop_token") || "";
    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const fallbackResponse = await fetch(`https://eticaret-backend-tvpe.onrender.com/api/orders/${id}/return-reject`, {
      method: "PUT",
      headers,
      body: JSON.stringify({ reason }),
    });

    const contentType = fallbackResponse.headers.get("content-type") || "";
    const payload = contentType.includes("application/json") ? await fallbackResponse.json() : null;

    if (!fallbackResponse.ok) {
      throw new Error(payload?.message || "Request failed.");
    }

    return payload;
  });
}
