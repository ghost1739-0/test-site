import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../api/ordersApi";
import { useAuth } from "../context/AuthContext";

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchMyOrders();
        setOrders(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-6 text-zinc-300">
        Siparislerini gormek icin giris yap.
        <Link to="/auth" className="ml-2 text-rose-400 hover:text-rose-300">Giris</Link>
      </div>
    );
  }

  if (loading) {
    return <p className="text-zinc-300">Siparisler yukleniyor...</p>;
  }

  if (error) {
    return <p className="text-rose-300">{error}</p>;
  }

  return (
    <main className="space-y-4">
      <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/75 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Alisveris gecmisi</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-100">Siparislerim</h1>
      </div>
      {orders.length === 0 ? (
        <p className="rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-6 text-zinc-300">Henuz siparisin yok.</p>
      ) : (
        orders.map((order) => (
          <Link
            key={order._id}
            to={`/orders/${order._id}`}
            className="block rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-rose-500/40 hover:bg-zinc-950"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-zinc-400">Siparis #{order._id.slice(-6)}</p>
                <p className="font-bold text-zinc-100">{order.orderItems.length} urun</p>
              </div>
              <div className="text-right">
                <p className="text-rose-400 font-black">{order.totalPrice} TL</p>
                <p className="text-sm text-zinc-400">{order.isDelivered ? "Teslim edildi" : "Hazirlaniyor"}</p>
              </div>
            </div>
          </Link>
        ))
      )}
    </main>
  );
}
