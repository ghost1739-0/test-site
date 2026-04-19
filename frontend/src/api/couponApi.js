import { request } from "./client";

export function validateCoupon(code, amount) {
  return request("/coupons/validate", {
    method: "POST",
    body: JSON.stringify({ code, amount }),
  });
}
