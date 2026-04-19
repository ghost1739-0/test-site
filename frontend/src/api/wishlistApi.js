import { request } from "./client";

export function fetchWishlist() {
  return request("/users/wishlist");
}

export function toggleWishlist(productId) {
  return request(`/users/wishlist/${productId}`, {
    method: "POST",
  });
}
