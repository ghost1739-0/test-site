import { useEffect, useState } from "react";
import {
  approveCancelAdmin,
  approveReturnAdmin,
  fetchAllOrdersAdmin,
  rejectReturnAdmin,
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
  const [orderActionMessage, setOrderActionMessage] = useState("");
  const [orderActionError, setOrderActionError] = useState("");
  const [pendingReturnActionId, setPendingReturnActionId] = useState("");
  const [returnRejectReasons, setReturnRejectReasons] = useState({});

  function trDiscountType(type) {
    if (type === "percent") return "Yüzde";
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
    return <p className="rounded-2xl border border-white/10 bg-zinc-950/70 p-6 text-zinc-300">Yönetici erişimi gerekli.</p>;
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
    setOrderActionMessage("");
    setOrderActionError("");
    setPendingReturnActionId(orderId);

    try {
      await approveReturnAdmin(orderId);
      setOrderActionMessage("İade onaylandı.");
      await loadAll();
    } catch (error) {
      setOrderActionError(error.message);
    } finally {
      setPendingReturnActionId("");
    }
  }

  async function handleRejectReturn(orderId) {
    const reason = (returnRejectReasons[orderId] || "").trim();
    setOrderActionMessage("");
    setOrderActionError("");
    setPendingReturnActionId(orderId);

    try {
      await rejectReturnAdmin(orderId, reason);
      setOrderActionMessage("İade reddedildi.");
      setReturnRejectReasons((current) => ({
        ...current,
        [orderId]: "",
      }));
      await loadAll();
    } catch (error) {
      setOrderActionError(error.message);
    } finally {
      setPendingReturnActionId("");
    }
  }

  async function handleCreateCoupon(event) {
    event.preventDefault();
    setMessage("");
    await createCoupon({
      ...couponForm,
      code: String(couponForm.code).toUpperCase(),
    });
    setCouponForm(initialCoupon);
    setMessage("Kupon oluşturuldu.");
    await loadAll();
  }

  async function handleDeleteCoupon(id) {
    await deleteCoupon(id);
    await loadAll();
  }

  return (
    <main className="space-y-6">
      <h1 className="text-3xl font-black text-zinc-100">Yönetici Paneli</h1>
      {orderActionMessage && <p className="text-sm text-emerald-300">{orderActionMessage}</p>}
      {orderActionError && <p className="text-sm text-rose-300">{orderActionError}</p>}

      {stats && (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[
            ["Kullanıcılar", stats.users],
            ["Ürünler", stats.products],
            ["Siparişler", stats.orders],
            ["Ödenen", stats.paidOrders],
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
        <h2 className="text-xl font-black text-zinc-100">Düşük stok uyarıları</h2>
        {alerts.length === 0 ? (
          <p className="mt-3 text-sm text-zinc-400">Stok uyarısı yok.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {alerts.map((item) => (
              <p key={item._id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-zinc-300">
                {item.name} - Stok {item.stock} (eşik {item.lowStockThreshold})
              </p>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr,1fr]">
        <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
          <h2 className="text-xl font-black text-zinc-100">Kuponlar</h2>
          <form onSubmit={handleCreateCoupon} className="mt-3 grid gap-2 sm:grid-cols-2">
            <label className="space-y-1 text-sm text-zinc-300">
              <span>Kupon kodu</span>
              <input
                value={couponForm.code}
                onChange={(event) => setCouponForm({ ...couponForm, code: event.target.value })}
                placeholder="Örn: HOSGELDIN10"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
                required
              />
            </label>
            <label className="space-y-1 text-sm text-zinc-300">
              <span>İndirim türü</span>
              <select
                value={couponForm.discountType}
                onChange={(event) => setCouponForm({ ...couponForm, discountType: event.target.value })}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
              >
                <option value="percent">Yüzde</option>
                <option value="fixed">Sabit tutar</option>
              </select>
            </label>
            <label className="space-y-1 text-sm text-zinc-300">
              <span>İndirim değeri</span>
              <input
                type="number"
                value={couponForm.discountValue}
                onChange={(event) => setCouponForm({ ...couponForm, discountValue: Number(event.target.value) })}
                placeholder="Yüzde ise 10, sabit ise 100"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
                required
              />
              <p className="text-xs text-zinc-500">Bu sayı, kuponun ne kadar indirim yapacağını belirler.</p>
            </label>
            <label className="space-y-1 text-sm text-zinc-300">
              <span>Minimum sepet tutarı (TL)</span>
              <input
                type="number"
                value={couponForm.minOrderAmount}
                onChange={(event) => setCouponForm({ ...couponForm, minOrderAmount: Number(event.target.value) })}
                placeholder="Örn: 500"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
              />
              <p className="text-xs text-zinc-500">Kuponun geçerli olması için sipariş toplamının ulaşması gereken alt limit.</p>
            </label>
            <label className="space-y-1 text-sm text-zinc-300 sm:col-span-2">
              <span>Maksimum indirim tutarı (TL)</span>
              <input
                type="number"
                value={couponForm.maxDiscountAmount}
                onChange={(event) => setCouponForm({ ...couponForm, maxDiscountAmount: Number(event.target.value) })}
                placeholder="Örn: 250"
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
              />
              <p className="text-xs text-zinc-500">Yüzde kuponlarda toplam indirimin çıkabileceği en yüksek sınır.</p>
            </label>
            <button className="rounded-xl bg-rose-500 px-4 py-2 text-white sm:col-span-2">Kupon oluştur</button>
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
          <h2 className="text-xl font-black text-zinc-100">Sipariş yönetimi</h2>
          <div className="mt-3 space-y-2">
            {orders.map((order) => (
              <article key={order._id} className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-zinc-300">#{order._id.slice(-6)} - {order.totalPrice} TL</p>
                  <p className="text-zinc-400">{trTrackingStatus(order.trackingStatus)}</p>
                </div>
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  {order.returnRequested && !order.returnRejectedAt && !order.returnedAt && (
                    <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-1 text-amber-300">İade bekliyor</span>
                  )}
                  {order.returnRejectedAt && (
                    <span className="rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-rose-300">İade reddedildi</span>
                  )}
                  {order.returnedAt && (
                    <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-emerald-300">İade onaylandı</span>
                  )}
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
                      type="button"
                      onClick={() => handleUpdateTracking(order._id, status)}
                      className="rounded-lg border border-white/10 px-2 py-1 text-zinc-200"
                    >
                      {trTrackingStatus(status)}
                    </button>
                  ))}
                  {order.cancelRequested && !order.canceledAt && (
                    <button type="button" onClick={() => handleApproveCancel(order._id)} className="rounded-lg bg-amber-500 px-2 py-1 text-black">
                      İptali onayla
                    </button>
                  )}
                  {order.returnRequested && !order.returnedAt && !order.returnRejectedAt && (
                    <>
                      <button type="button" onClick={() => handleApproveReturn(order._id)} className="rounded-lg bg-emerald-500 px-2 py-1 text-black">
                        {pendingReturnActionId === order._id ? "İşleniyor..." : "İadeyi onayla"}
                      </button>
                      <input
                        value={returnRejectReasons[order._id] || ""}
                        onChange={(event) =>
                          setReturnRejectReasons((current) => ({
                            ...current,
                            [order._id]: event.target.value,
                          }))
                        }
                        placeholder="Red nedeni yaz"
                        className="min-w-[180px] rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1 text-zinc-100"
                      />
                      <button
                        type="button"
                        onClick={() => handleRejectReturn(order._id)}
                        disabled={pendingReturnActionId === order._id}
                        className="rounded-lg bg-rose-500 px-2 py-1 text-white disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {pendingReturnActionId === order._id ? "Gönderiliyor..." : "İadeyi reddet"}
                      </button>
                    </>
                  )}
                </div>
                {order.returnReason && (
                  <p className="mt-2 text-xs text-zinc-400">
                    İade nedeni: <span className="text-zinc-200">{order.returnReason}</span>
                  </p>
                )}
                {order.returnRejectedAt && (
                  <p className="mt-1 text-xs text-rose-300">
                    Ret nedeni: <span className="text-zinc-100">{order.returnRejectReason || "Belirtilmedi."}</span>
                  </p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
