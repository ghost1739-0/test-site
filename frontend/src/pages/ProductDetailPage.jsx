import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { createProductReview, fetchProductById } from "../api/productsApi";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { trCategory } from "../utils/localeTr";

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      const data = await fetchProductById(id);
      setProduct(data);
      setLoading(false);
    }

    loadProduct();
  }, [id]);

  if (loading) {
    return <p className="text-zinc-300">Urun yukleniyor...</p>;
  }

  if (!product) {
    return (
      <div className="rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-6">
        <p className="text-zinc-300">Urun bulunamadi.</p>
        <Link to="/" className="mt-4 inline-block text-rose-400 hover:text-rose-300">
          Urunlere don
        </Link>
      </div>
    );
  }

  async function handleSubmitReview(event) {
    event.preventDefault();
    setReviewError("");
    setReviewSuccess("");

    try {
      await createProductReview(id, { rating, comment });
      setReviewSuccess("Yorum eklendi.");
      setComment("");
      const updated = await fetchProductById(id);
      setProduct(updated);
    } catch (error) {
      setReviewError(error.message);
    }
  }

  return (
    <main className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/70 shadow-[0_20px_80px_rgba(0,0,0,0.28)]">
        <img src={product.imageUrl} alt={product.name} className="h-full min-h-[520px] w-full object-cover" />
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">{trCategory(product.category)}</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight text-zinc-100">{product.name}</h1>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Puan {product.rating ?? 0}/5</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Stok {product.stock ?? 0}</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Hizli teslimat</span>
        </div>
        <p className="mt-6 text-zinc-300 leading-7">{product.description}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["Guvenli", "Odeme"],
            ["Hizli", "Teslimat"],
            ["Kolay", "Iade"],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-lg font-black text-rose-400">{title}</p>
              <p className="text-sm text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-[1.75rem] border border-white/10 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Fiyat</p>
            <p className="text-4xl font-black text-rose-400">{product.price} TL</p>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 px-6 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:brightness-110"
          >
            Sepete ekle
          </button>
        </div>

        <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/5 p-5">
          <h3 className="text-xl font-black text-zinc-100">Yorumlar ({product.numReviews || 0})</h3>

          <div className="mt-4 space-y-3">
            {(product.reviews || []).length === 0 ? (
              <p className="text-sm text-zinc-400">Henuz yorum yok.</p>
            ) : (
              product.reviews.map((review) => (
                <div key={review._id} className="rounded-2xl border border-white/10 bg-zinc-950/70 p-3">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-zinc-100">{review.name}</p>
                    <p className="text-sm text-rose-400">{review.rating}/5</p>
                  </div>
                  <p className="mt-2 text-sm text-zinc-400">{review.comment}</p>
                </div>
              ))
            )}
          </div>

          {user ? (
            <form onSubmit={handleSubmitReview} className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-zinc-300">Puan</label>
                <select
                  value={rating}
                  onChange={(event) => setRating(Number(event.target.value))}
                  className="rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                >
                  {[5, 4, 3, 2, 1].map((star) => (
                    <option key={star} value={star}>{star}</option>
                  ))}
                </select>
              </div>

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Yorumunu yaz..."
                className="h-24 w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none"
                required
              />

              {reviewError && <p className="text-sm text-rose-300">{reviewError}</p>}
              {reviewSuccess && <p className="text-sm text-emerald-300">{reviewSuccess}</p>}

              <button className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white">Yorumu gonder</button>
            </form>
          ) : (
            <p className="mt-4 text-sm text-zinc-400">Yorum yapmak icin giris yap.</p>
          )}
        </div>
      </section>
    </main>
  );
}
