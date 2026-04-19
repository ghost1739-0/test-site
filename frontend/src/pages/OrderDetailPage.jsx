import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrderById, requestReturnOrder } from "../api/ordersApi";
import { trPaymentMethod, trPaymentStatus, trTrackingStatus } from "../utils/localeTr";

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    async function loadOrder() {
      try {
        const data = await fetchOrderById(id);
        setOrder(data);
      } catch (loadError) {
        setError(loadError.message);
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [id]);

  if (loading) return <p className="text-zinc-300">Sipariş yükleniyor...</p>;
  if (error) return <p className="text-rose-300">{error}</p>;
  if (!order) return <p className="text-zinc-300">Sipariş bulunamadı.</p>;

  async function handleReturnRequest() {
    try {
      await requestReturnOrder(id, "Müşteri iade talebi oluşturdu");
      setActionMessage("İade talebi gönderildi.");
      const data = await fetchOrderById(id);
      setOrder(data);
    } catch (actionError) {
      setActionMessage(actionError.message);
    }
  }

  return (
    <main className="space-y-6 rounded-[2rem] border border-white/10 bg-zinc-950/75 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Sipariş #{order._id}</p>
          <h1 className="text-3xl font-black tracking-tight text-zinc-100">Sipariş detayları</h1>
        </div>
        <Link to="/orders" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-rose-500/50 hover:text-white">
          Siparişlere dön
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="space-y-3 rounded-[1.75rem] border border-white/10 bg-white/5 p-4">
          <h2 className="font-black text-zinc-100">Ürünler</h2>
          {order.orderItems.map((item) => (
            <div key={item.product} className="flex items-center justify-between rounded-2xl border border-white/5 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-300">
              <span>{item.name} x {item.quantity}</span>
              <span>{item.price * item.quantity} TL</span>
            </div>
          ))}
        </section>
        <section className="space-y-2 rounded-[1.75rem] border border-white/10 bg-white/5 p-4 text-zinc-300">
          <h2 className="font-black text-zinc-100">Teslimat</h2>
          <p>{order.shippingAddress.address}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
          <p>{order.shippingAddress.country}</p>
          <p className="pt-3 text-sm">Ödeme yöntemi: {trPaymentMethod(order.paymentMethod)}</p>
          <p className="text-sm">Durum: {trTrackingStatus(order.trackingStatus)}</p>
        </section>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleReturnRequest}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100"
          disabled={!order.isDelivered || Boolean(order.returnedAt)}
        >
          İade talebi oluştur
        </button>
        {actionMessage && <p className="self-center text-sm text-zinc-300">{actionMessage}</p>}
      </div>

      <div className="flex justify-end rounded-[1.75rem] border border-white/10 bg-white/5 p-4 text-right">
        <div>
          <p className="text-sm text-zinc-400">Toplam</p>
          <p className="text-3xl font-black text-rose-400">{order.totalPrice} TL</p>
        </div>
      </div>
    </main>
  );
}
