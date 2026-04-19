import { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/ProductCard";
import ProductFilters from "../components/ProductFilters";
import { fetchProductsPage } from "../api/productsApi";

function parsePriceRange(value) {
  if (!value) {
    return {};
  }

  const [minPrice, maxPrice] = value.split("-").map(Number);
  return { minPrice, maxPrice };
}

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 12 });

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))],
    [products]
  );

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      const { minPrice, maxPrice } = parsePriceRange(price);
      const payload = await fetchProductsPage({
        category: category || undefined,
        minPrice,
        maxPrice,
        search: search || undefined,
        sort,
        page,
        limit: 9,
      });
      setProducts(payload.data || []);
      setPagination(payload.pagination || { page: 1, pages: 1, total: 0, limit: 9 });
      setLoading(false);
    }

    loadProducts();
  }, [category, price, search, sort, page]);

  useEffect(() => {
    setPage(1);
  }, [category, price, search, sort]);

  return (
    <main className="space-y-6">
      <div className="space-y-6">
        <ProductFilters
          categories={categories}
          selectedCategory={category}
          selectedPrice={price}
          onCategoryChange={setCategory}
          onPriceChange={setPrice}
        />

        <section>
          {loading ? (
            <p className="text-zinc-300">Ürünler yükleniyor...</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              disabled={pagination.page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 disabled:opacity-40"
            >
              Önceki
            </button>
            <button
              disabled={pagination.page >= pagination.pages}
              onClick={() => setPage((current) => Math.min(pagination.pages, current + 1))}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-zinc-200 disabled:opacity-40"
            >
              Sonraki
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
