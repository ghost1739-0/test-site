import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { items } = useWishlist();
  const isAdmin = user?.role === "admin";

  return (
    <header className="sticky top-0 z-30 mb-8 overflow-hidden rounded-b-3xl border-b border-white/10 bg-zinc-950/90 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="hidden items-center justify-between border-b border-white/10 px-6 py-2 text-xs text-zinc-400 lg:flex">
        <p>İndirim kuponlarım</p>
        <div className="flex items-center gap-6">
          <p>Hakkımızda</p>
          <p>Yardım ve Destek</p>
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap lg:gap-6">
          <Link to="/" className="shrink-0 text-3xl font-black leading-none tracking-tight text-zinc-100">
            Eren Web
          </Link>

          <label className="relative min-w-[220px] flex-1">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">🔎</span>
            <input
              type="text"
              placeholder="Ürün, kategori veya marka ara"
              className="w-full rounded-xl border border-white/10 bg-zinc-900 py-3 pl-11 pr-4 text-sm text-zinc-100 outline-none transition focus:border-rose-500"
            />
          </label>

          <div className="ml-auto flex flex-wrap items-center gap-2 text-sm font-semibold">
            {user ? (
              <button
                onClick={logout}
                className="rounded-full border border-white/15 bg-zinc-900 px-4 py-2 text-zinc-200 transition hover:border-rose-500/50 hover:text-white"
              >
                {user.name} / Çıkış
              </button>
            ) : (
              <NavLink
                to="/auth"
                className="rounded-full border border-white/15 bg-zinc-900 px-4 py-2 text-zinc-200 transition hover:border-rose-500/50 hover:text-white"
              >
                Giriş Yap
              </NavLink>
            )}
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition ${isActive ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`
              }
            >
              Favorilerim ({items.length})
            </NavLink>
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition ${isActive ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`
              }
            >
              Sepetim ({totalItems})
            </NavLink>
          </div>
        </div>

        <nav className="flex flex-wrap items-center gap-2 border-t border-white/10 pt-3 text-sm font-semibold">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${isActive ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`
            }
          >
            Ürünler
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${isActive ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`
            }
          >
            Siparişler
          </NavLink>

          {isAdmin && (
            <>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${isActive ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`
                }
              >
                Panel
              </NavLink>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 transition ${isActive ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`
                }
              >
                Yönetim
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
