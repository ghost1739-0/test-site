import { Link } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { useAuth } from "../context/AuthContext";

export default function WishlistPage() {
  const { items } = useWishlist();
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-6 text-zinc-300">
        Favorileri kullanmak icin giris yap. <Link to="/auth" className="text-rose-400">Giris</Link>
      </div>
    );
  }

  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-black text-zinc-100">Favoriler</h1>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 text-zinc-300">Henuz favori urun yok.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
