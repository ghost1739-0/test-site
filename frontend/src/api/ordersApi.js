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
