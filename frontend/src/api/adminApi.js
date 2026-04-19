import { request } from "./client";

export function fetchAdminStats() {
  return request("/admin/stats");
}

export function fetchStockAlerts() {
  return request("/admin/stock-alerts");
}

export function fetchCoupons() {
  return request("/admin/coupons");
}

export function createCoupon(payload) {
  return request("/admin/coupons", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateCoupon(id, payload) {
  return request(`/admin/coupons/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteCoupon(id) {
  return request(`/admin/coupons/${id}`, {
    method: "DELETE",
  });
}
