import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { createOrder } from "../api/ordersApi";
import { validateCoupon } from "../api/couponApi";
import { createCheckoutSession } from "../api/paymentApi";
import { trPaymentMethod } from "../utils/localeTr";

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "Turkiye",
  });
  const [paymentMethod, setPaymentMethod] = useState("Cash on delivery");
  const [couponCode, setCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  const discountedSubtotal = Math.max(totalPrice - couponDiscount, 0);
  const shippingTotal = discountedSubtotal > 5000 ? 0 : 99;
  const taxTotal = Math.round(discountedSubtotal * 0.18);
  const grandTotal = discountedSubtotal + shippingTotal + taxTotal;

  async function handleApplyCoupon() {
    setCouponMessage("");
    try {
      const payload = await validateCoupon(couponCode, totalPrice);
      setCouponDiscount(payload.discount || 0);
      setCouponMessage(`Kupon uygulandi: -${payload.discount} TL`);
    } catch (error) {
      setCouponDiscount(0);
      setCouponMessage(error.message);
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!user) {
      setError("Odeme icin once giris yap.");
      return;
    }

    setSaving(true);

    try {
      const order = await createOrder({
        orderItems: items.map((item) => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        shippingAddress,
        paymentMethod,
        couponCode,
      });

      if (paymentMethod === "Credit card") {
        const checkout = await createCheckoutSession(items, {
          orderId: order._id,
          userId: user._id,
        });
        window.location.href = checkout.url;
        return;
      }

      clearCart();
      navigate(`/orders/${order._id}`);
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-6 text-zinc-300">
        Sepet bos. Odemeden once urun ekle.
      </div>
    );
  }

  return (
    <main className="grid gap-6 lg:grid-cols-[1.15fr,0.85fr]">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-[2rem] border border-white/10 bg-zinc-950/75 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-black tracking-tight text-zinc-100">Odeme</h1>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-zinc-400">Adim 1 / 1</span>
        </div>
        {!user && <p className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-sm text-amber-300">Siparis icin giris gerekli.</p>}

        <div className="grid gap-4 sm:grid-cols-2">
          <input
            value={shippingAddress.address}
            onChange={(event) => setShippingAddress({ ...shippingAddress, address: event.target.value })}
            placeholder="Adres"
            className="rounded-2xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-zinc-100 outline-none transition focus:border-rose-500"
            required
          />
          <input
            value={shippingAddress.city}
            onChange={(event) => setShippingAddress({ ...shippingAddress, city: event.target.value })}
            placeholder="Sehir"
            className="rounded-2xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-zinc-100 outline-none transition focus:border-rose-500"
            required
          />
          <input
            value={shippingAddress.postalCode}
            onChange={(event) => setShippingAddress({ ...shippingAddress, postalCode: event.target.value })}
            placeholder="Posta kodu"
            className="rounded-2xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-zinc-100 outline-none transition focus:border-rose-500"
            required
          />
          <input
            value={shippingAddress.country}
            onChange={(event) => setShippingAddress({ ...shippingAddress, country: event.target.value })}
            placeholder="Ulke"
            className="rounded-2xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-zinc-100 outline-none transition focus:border-rose-500"
            required
          />
        </div>

        <select
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value)}
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-zinc-100 outline-none transition focus:border-rose-500"
        >
          <option value="Cash on delivery">{trPaymentMethod("Cash on delivery")}</option>
          <option value="Credit card">{trPaymentMethod("Credit card")}</option>
          <option value="Bank transfer">{trPaymentMethod("Bank transfer")}</option>
        </select>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
          <label className="mb-2 block text-sm text-zinc-300">Kupon kodu</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={couponCode}
              onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
              placeholder="ORN: WELCOME10"
              className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-2 text-zinc-100 outline-none"
            />
            <button
              type="button"
              onClick={handleApplyCoupon}
              className="w-full rounded-xl bg-zinc-800 px-4 py-2 text-sm font-semibold text-zinc-100 sm:w-auto"
            >
              Uygula
            </button>
          </div>
          {couponMessage && <p className="mt-2 text-sm text-zinc-300">{couponMessage}</p>}
        </div>

        {error && <p className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}

        <button
          disabled={saving}
          className="w-full rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:brightness-110 disabled:opacity-60 sm:w-auto"
        >
            {saving ? "Siparis olusturuluyor..." : "Siparisi tamamla"}
        </button>
      </form>

      <aside className="space-y-4 rounded-[2rem] border border-white/10 bg-zinc-950/75 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.26)] backdrop-blur-xl">
        <h2 className="text-xl font-black text-zinc-100">Siparis ozeti</h2>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-3 text-sm text-zinc-300">
              <span>{item.name} x {item.quantity}</span>
              <span>{item.price * item.quantity} TL</span>
            </div>
          ))}
        </div>
        <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-sm text-zinc-300">
            <span>Ara toplam</span>
            <span>{totalPrice} TL</span>
          </div>
          <div className="flex items-center justify-between text-sm text-zinc-300">
            <span>Indirim</span>
            <span>-{couponDiscount} TL</span>
          </div>
          <div className="flex items-center justify-between text-sm text-zinc-300">
            <span>Kargo</span>
            <span>{shippingTotal} TL</span>
          </div>
          <div className="flex items-center justify-between text-sm text-zinc-300">
            <span>Vergi</span>
            <span>{taxTotal} TL</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-lg font-black text-rose-400">
            <span>Toplam</span>
            <span>{grandTotal} TL</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
