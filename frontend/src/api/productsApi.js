import { request } from "./client";
import { fallbackProducts } from "../data/fallbackProducts";

export async function fetchProductsPage(filters = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && typeof value !== "undefined") {
      searchParams.append(key, String(value));
    }
  });

  try {
    const payload = await request(`/products?${searchParams.toString()}`);
    return payload;
  } catch (error) {
    return {
      data: fallbackProducts,
      pagination: {
        total: fallbackProducts.length,
        page: 1,
        pages: 1,
        limit: fallbackProducts.length,
      },
    };
  }
}

export async function fetchProducts(filters = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && typeof value !== "undefined") {
      searchParams.append(key, String(value));
    }
  });

  try {
    const payload = await request(`/products?${searchParams.toString()}`);
    return payload.data || [];
  } catch (error) {
    return fallbackProducts.filter((product) => {
      if (filters.category && product.category !== filters.category) {
        return false;
      }

      if (filters.search && !product.name.toLowerCase().includes(String(filters.search).toLowerCase())) {
        return false;
      }

      if (typeof filters.minPrice !== "undefined" && product.price < Number(filters.minPrice)) {
        return false;
      }

      if (typeof filters.maxPrice !== "undefined" && product.price > Number(filters.maxPrice)) {
        return false;
      }

      return true;
    });
  }
}

export async function fetchProductById(id) {
  try {
    return await request(`/products/${id}`);
  } catch (error) {
    return fallbackProducts.find((product) => product._id === id) || null;
  }
}

export function createProduct(payload) {
  return request("/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateProduct(id, payload) {
  return request(`/admin/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteProduct(id) {
  return request(`/admin/products/${id}`, {
    method: "DELETE",
  });
}

export function createProductReview(id, payload) {
  return request(`/products/${id}/reviews`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
