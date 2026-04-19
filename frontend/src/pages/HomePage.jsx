import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
      <section className="overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/60 p-6 backdrop-blur-md">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-zinc-400">Premium storefront</p>
          <h1 className="mt-3 text-4xl font-black leading-tight text-zinc-100 sm:text-6xl">
            Modern bir e-ticaret sitesinden beklediğin her şey.
          </h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Temiz bir arayüzle ara, filtrele, ürün incele, sepete ekle, ödeme yap ve siparişlerini takip et.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/checkout" className="rounded-full bg-rose-500 px-5 py-3 font-semibold text-white transition hover:bg-rose-400">
              Ödemeye git
            </Link>
            <Link to="/orders" className="rounded-full border border-zinc-700 px-5 py-3 font-semibold text-zinc-200 transition hover:border-rose-500 hover:text-rose-300">
              Siparişleri gör
            </Link>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <ProductFilters
          categories={categories}
          selectedCategory={category}
          selectedPrice={price}
          onCategoryChange={setCategory}
          onPriceChange={setPrice}
        />

        <section>
          <div className="mb-5 rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-extrabold text-zinc-100">Öne Çıkan Ürünler</h2>
              <span className="text-sm text-zinc-400">{pagination.total} ürün</span>
            </div>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Ürün adına göre ara..."
              className="mt-4 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none focus:border-rose-500"
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-zinc-400">Sayfa {pagination.page} / {pagination.pages || 1}</div>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 outline-none"
              >
                <option value="-createdAt">En yeni</option>
                <option value="price">Fiyat: Artan</option>
                <option value="-price">Fiyat: Azalan</option>
                <option value="-rating">Puana göre</option>
              </select>
            </div>
          </div>

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
