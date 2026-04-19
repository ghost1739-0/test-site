import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, logout } = useAuth();
  const { items } = useWishlist();

  return (
    <header className="sticky top-4 z-20 mb-8 rounded-[1.75rem] border border-white/10 bg-zinc-950/70 px-5 py-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <Link to="/" className="flex items-center gap-3 self-start">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-rose-500 to-fuchsia-600 text-sm font-black text-white shadow-lg shadow-rose-500/20">
            EA
          </span>
          <span>
            <span className="block text-2xl font-black tracking-tight text-zinc-100">E-Architect</span>
            <span className="text-xs uppercase tracking-[0.32em] text-zinc-400">Premium Ticaret</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center gap-3 text-sm font-semibold">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${isActive ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`
            }
          >
            Urunler
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${isActive ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`
            }
          >
            Siparisler
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${isActive ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`
            }
          >
            Sepet ({totalItems})
          </NavLink>
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `rounded-full px-4 py-2 transition ${isActive ? "bg-rose-500 text-white" : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"}`
            }
          >
            Favoriler ({items.length})
          </NavLink>
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
            Yonetim
          </NavLink>
          {user ? (
            <button
              onClick={logout}
              className="rounded-full border border-white/10 bg-zinc-800/80 px-4 py-2 text-zinc-200 transition hover:border-rose-500/50 hover:text-white"
            >
              {user.name} / Cikis
            </button>
          ) : (
            <NavLink
              to="/auth"
              className="rounded-full border border-white/10 bg-zinc-800/80 px-4 py-2 text-zinc-200 transition hover:border-rose-500/50 hover:text-white"
            >
              Giris
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
