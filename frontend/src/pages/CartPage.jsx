import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, totalPrice, addToCart, decreaseItem, removeFromCart, clearCart } = useCart();

  return (
    <main className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[1.75rem] border border-white/10 bg-zinc-950/75 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Kayitli urunler</p>
          <h1 className="text-2xl font-black tracking-tight text-zinc-100">Sepetim</h1>
        </div>
        <button
          onClick={clearCart}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-rose-500/50 hover:text-white"
        >
          Sepeti temizle
        </button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-[1.75rem] border border-dashed border-zinc-700 p-6 text-zinc-400">
          <p>Sepet bos. Ana sayfadan urun ekleyebilirsin.</p>
          <Link to="/" className="mt-4 inline-block rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 px-4 py-2 font-semibold text-white">
            Urunleri incele
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item._id}
              className="flex flex-col gap-3 rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <img src={item.imageUrl} alt={item.name} className="h-20 w-20 rounded-2xl object-cover ring-1 ring-white/10" />
                <div>
                  <h3 className="font-bold text-zinc-100">{item.name}</h3>
                  <p className="text-sm text-zinc-400">{item.price} TL</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => decreaseItem(item._id)}
                  className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-200 transition hover:bg-zinc-700"
                >
                  -
                </button>
                <span className="min-w-8 text-center font-semibold text-zinc-100">{item.quantity}</span>
                <button
                  onClick={() => addToCart(item)}
                  className="rounded-full bg-zinc-800 px-3 py-1 text-zinc-200 transition hover:bg-zinc-700"
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="ml-2 rounded-full bg-rose-500 px-3 py-1 text-sm font-semibold text-white transition hover:bg-rose-400"
                >
                  Sil
                </button>
              </div>
            </article>
          ))}

          <div className="flex justify-end rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
            <div className="flex items-center gap-4">
              <Link to="/checkout" className="rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 px-5 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:brightness-110">
                Odeme
              </Link>
              <p className="text-lg font-extrabold text-rose-400">Toplam: {totalPrice} TL</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
