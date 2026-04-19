import { request } from "./client";

export function createCheckoutSession(items, metadata = {}) {
  return request("/payments/create-checkout-session", {
    method: "POST",
    body: JSON.stringify({ items, metadata }),
  });
}
