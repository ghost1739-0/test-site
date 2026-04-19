import { useEffect, useState } from "react";
import { createProduct, deleteProduct, fetchProducts, updateProduct } from "../api/productsApi";
import { useAuth } from "../context/AuthContext";
import { uploadProductImage } from "../api/uploadApi";

const emptyForm = {
  name: "",
  description: "",
  category: "",
  price: 0,
  stock: 0,
  imageUrl: "",
  rating: 4.5,
};

export default function AdminProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    const data = await fetchProducts({ limit: 100 });
    setProducts(data);
  };

  useEffect(() => {
    load();
  }, []);

  if (!user || user.role !== "admin") {
    return <p className="rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-6 text-zinc-300">Yonetici erisimi gerekli.</p>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    if (editingId) {
      await updateProduct(editingId, form);
      setMessage("Urun guncellendi.");
    } else {
      await createProduct(form);
      setMessage("Urun olusturuldu.");
    }

    setForm(emptyForm);
    setEditingId("");
    await load();
  };

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      rating: product.rating,
    });
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    await load();
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    try {
      const payload = await uploadProductImage(file);
      setForm((prev) => ({ ...prev, imageUrl: `http://localhost:5000${payload.fileUrl}` }));
      setMessage("Gorsel yuklendi.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="grid gap-6 lg:grid-cols-[420px,1fr]">
      <form onSubmit={handleSubmit} className="space-y-3 rounded-[2rem] border border-white/10 bg-zinc-950/75 p-5 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
        <p className="text-xs uppercase tracking-[0.35em] text-zinc-500">Yonetim paneli</p>
        <h1 className="text-2xl font-black tracking-tight text-zinc-100">Urun Yonetimi</h1>
        {message && <p className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-sm text-emerald-300">{message}</p>}
        {Object.entries(form).map(([key, value]) => (
          <input
            key={key}
            value={value}
            onChange={(event) => setForm({ ...form, [key]: key === "price" || key === "stock" || key === "rating" ? Number(event.target.value) : event.target.value })}
            placeholder={key}
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-zinc-100 outline-none transition focus:border-rose-500"
            required
          />
        ))}
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-zinc-100"
        />
        {uploading && <p className="text-sm text-zinc-300">Gorsel yukleniyor...</p>}
        <button className="rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:brightness-110">
          {editingId ? "Urunu guncelle" : "Urun olustur"}
        </button>
      </form>

      <div className="space-y-3">
        {products.map((product) => (
          <article key={product._id} className="flex items-center justify-between rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-4 transition hover:border-rose-500/30">
            <div>
              <h3 className="font-bold text-zinc-100">{product.name}</h3>
              <p className="text-sm text-zinc-400">{product.category} · {product.price} TL · Stok {product.stock}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(product)} className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-100 transition hover:border-rose-500/50">Duzenle</button>
              <button onClick={() => handleDelete(product._id)} className="rounded-full bg-rose-500 px-3 py-2 text-sm text-white transition hover:bg-rose-400">Sil</button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
