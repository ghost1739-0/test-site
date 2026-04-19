import { useEffect, useState } from "react";
import {
  approveCancelAdmin,
  approveReturnAdmin,
  fetchAllOrdersAdmin,
  updateTrackingAdmin,
} from "../api/ordersApi";
import { createCoupon, deleteCoupon, fetchAdminStats, fetchCoupons, fetchStockAlerts } from "../api/adminApi";
import { useAuth } from "../context/AuthContext";
import { trTrackingStatus } from "../utils/localeTr";

const initialCoupon = {
  code: "",
  discountType: "percent",
  discountValue: 10,
  minOrderAmount: 0,
  maxDiscountAmount: 0,
  isActive: true,
};

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [couponForm, setCouponForm] = useState(initialCoupon);
  const [message, setMessage] = useState("");

  function trDiscountType(type) {
    if (type === "percent") return "Yuzde";
    if (type === "fixed") return "Sabit";
    return type;
  }

  async function loadAll() {
    const [statsPayload, alertPayload, ordersPayload, couponPayload] = await Promise.all([
      fetchAdminStats(),
      fetchStockAlerts(),
      fetchAllOrdersAdmin(),
      fetchCoupons(),
    ]);
    setStats(statsPayload);
    setAlerts(alertPayload);
    setOrders(ordersPayload);
    setCoupons(couponPayload);
  }

  useEffect(() => {
    if (user?.role === "admin") {
      loadAll();
    }
  }, [user]);

  if (!user || user.role !== "admin") {
    return <p className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 text-zinc-300">Yonetici erisimi gerekli.</p>;
  }

  async function handleUpdateTracking(orderId, status) {
    await updateTrackingAdmin(orderId, { trackingStatus: status });
    await loadAll();
  }

  async function handleApproveCancel(orderId) {
    await approveCancelAdmin(orderId);
    await loadAll();
  }

  async function handleApproveReturn(orderId) {
    await approveReturnAdmin(orderId);
    await loadAll();
  }

  async function handleCreateCoupon(event) {
    event.preventDefault();
    setMessage("");
    await createCoupon({
      ...couponForm,
      code: String(couponForm.code).toUpperCase(),
    });
    setCouponForm(initialCoupon);
    setMessage("Kupon olusturuldu.");
    await loadAll();
  }

  async function handleDeleteCoupon(id) {
    await deleteCoupon(id);
    await loadAll();
  }

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-black text-zinc-100">Yonetici Paneli</h1>

      {stats && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Kullanicilar", stats.users],
            ["Urunler", stats.products],
            ["Siparisler", stats.orders],
            ["Odenen", stats.paidOrders],
            ["Ciro", `${Math.round(stats.totalSales)} TL`],
          ].map(([title, value]) => (
            <article key={title} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
              <p className="text-sm text-zinc-400">{title}</p>
              <p className="mt-1 text-2xl font-black text-rose-400">{value}</p>
            </article>
          ))}
        </section>
      )}

      <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
        <h2 className="text-xl font-black text-zinc-100">Dusuk stok uyarilari</h2>
        {alerts.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">Stok uyarisi yok.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {alerts.map((item) => (
              <p key={item._id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-300">
                {item.name} - Stok {item.stock} (esik {item.lowStockThreshold})
              </p>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
          <h2 className="text-xl font-black text-zinc-100">Kuponlar</h2>
          <form onSubmit={handleCreateCoupon} className="mt-3 grid gap-2 sm:grid-cols-2">
            <input
              value={couponForm.code}
              onChange={(event) => setCouponForm({ ...couponForm, code: event.target.value })}
              placeholder="Kod"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
              required
            />
            <select
              value={couponForm.discountType}
              onChange={(event) => setCouponForm({ ...couponForm, discountType: event.target.value })}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            >
              <option value="percent">Yuzde</option>
              <option value="fixed">Sabit</option>
            </select>
            <input
              type="number"
              value={couponForm.discountValue}
              onChange={(event) => setCouponForm({ ...couponForm, discountValue: Number(event.target.value) })}
              placeholder="Indirim"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
              required
            />
            <input
              type="number"
              value={couponForm.minOrderAmount}
              onChange={(event) => setCouponForm({ ...couponForm, minOrderAmount: Number(event.target.value) })}
              placeholder="Minimum siparis"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            />
            <input
              type="number"
              value={couponForm.maxDiscountAmount}
              onChange={(event) => setCouponForm({ ...couponForm, maxDiscountAmount: Number(event.target.value) })}
              placeholder="Maksimum indirim"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            />
            <button className="rounded-xl bg-rose-500 px-4 py-2 text-white">Kupon olustur</button>
          </form>

          {message && <p className="mt-2 text-sm text-emerald-300">{message}</p>}

          <div className="mt-4 space-y-2">
            {coupons.map((coupon) => (
              <div key={coupon._id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                <div className="text-zinc-300">
                  {coupon.code} - {trDiscountType(coupon.discountType)} {coupon.discountValue}
                </div>
                <button onClick={() => handleDeleteCoupon(coupon._id)} className="rounded-lg bg-rose-500 px-3 py-1 text-white">
                  Sil
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
          <h2 className="text-xl font-black text-zinc-100">Siparis yonetimi</h2>
          <div className="mt-3 space-y-2">
            {orders.map((order) => (
              <article key={order._id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-zinc-300">#{order._id.slice(-6)} - {order.totalPrice} TL</p>
                  <p className="text-zinc-400">{trTrackingStatus(order.trackingStatus)}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[
                    "processing",
                    "shipped",
                    "in_transit",
                    "delivered",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleUpdateTracking(order._id, status)}
                      className="rounded-lg border border-white/10 px-2 py-1 text-zinc-200"
                    >
                      {trTrackingStatus(status)}
                    </button>
                  ))}
                  {order.cancelRequested && !order.canceledAt && (
                    <button onClick={() => handleApproveCancel(order._id)} className="rounded-lg bg-amber-500 px-2 py-1 text-black">
                      Iptali onayla
                    </button>
                  )}
                  {order.returnRequested && !order.returnedAt && (
                    <button onClick={() => handleApproveReturn(order._id)} className="rounded-lg bg-emerald-500 px-2 py-1 text-black">
                      Iadeyi onayla
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
