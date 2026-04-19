import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useAuth } from "../context/AuthContext";
import { trCategory } from "../utils/localeTr";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { ids, toggle } = useWishlist();
  const { user } = useAuth();
  const isFavorite = ids.has(product._id);

  async function handleWishlistToggle() {
    if (!user) {
      return;
    }
    try {
      await toggle(product._id);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-zinc-950/70 shadow-[0_20px_60px_rgba(0,0,0,0.22)] transition duration-300 hover:-translate-y-1 hover:border-rose-500/40 hover:shadow-[0_24px_90px_rgba(244,63,94,0.16)]">
      <div className="relative overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="h-56 w-full object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-70" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="rounded-full bg-zinc-950/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-zinc-100 backdrop-blur-md">
            {trCategory(product.category)}
          </span>
          <span className="rounded-full bg-rose-500/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
            Stok: {product.stock}
          </span>
        </div>
        <button
          onClick={handleWishlistToggle}
          className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] backdrop-blur-md transition ${
            isFavorite
              ? "border-rose-400 bg-rose-500/80 text-white"
              : "border-white/20 bg-zinc-950/70 text-zinc-200 hover:border-rose-400"
          }`}
        >
          {isFavorite ? "Favori" : "Favorilere ekle"}
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-black tracking-tight text-zinc-100">{product.name}</h3>
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-300">
            {product.rating}/5
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-6 text-zinc-400">{product.description}</p>

        <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-zinc-500">
          <span>Hızlı kargo</span>
          <span>Güvenli ödeme</span>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Fiyat</p>
            <p className="text-2xl font-black text-rose-400">{product.price} TL</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={`/products/${product._id}`}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-rose-500 hover:bg-rose-500/10 hover:text-white"
            >
              İncele
            </Link>
            <button
              onClick={() => addToCart(product)}
              className="rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:brightness-110"
            >
              Ekle
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
