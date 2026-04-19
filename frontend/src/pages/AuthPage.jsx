import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("admin@earchitect.com");
  const [password, setPassword] = useState("Admin123!");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);

    try {
      if (mode === "login") {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      navigate("/");
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900/80 to-zinc-950 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
        <p className="text-sm uppercase tracking-[0.3em] text-zinc-500">Uye paneli</p>
        <h1 className="mt-3 text-4xl font-black leading-tight text-zinc-100 sm:text-5xl">
          Sepet, siparis ve yonetim araclarini kullanmak icin giris yap.
        </h1>
        <p className="mt-4 max-w-xl text-zinc-300">
          Hazir demo hesabi kullanabilir veya yeni bir hesap olusturabilirsin.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            ["Guvenli", "JWT kimlik"],
            ["Hizli", "Otomatik profil"],
            ["Demo", "Yonetici erisimi"],
          ].map(([title, desc]) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-lg font-black text-rose-400">{title}</p>
              <p className="text-sm text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-zinc-950/75 p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-zinc-100">{mode === "login" ? "Giris Yap" : "Hesap Olustur"}</h2>
          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-200 transition hover:border-rose-500/50 hover:text-white"
          >
            {mode === "login" ? "Hesabin yok mu?" : "Hesabin var mi?"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-300">Ad Soyad</label>
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition focus:border-rose-500"
                placeholder="Ad soyad"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-300">E-posta</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition focus:border-rose-500"
              placeholder="demo@email.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-300">Sifre</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-zinc-100 outline-none transition focus:border-rose-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && <p className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-300">{error}</p>}

          <button
            disabled={saving}
            className="w-full rounded-2xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-4 py-3 font-semibold text-white shadow-lg shadow-rose-500/20 transition hover:brightness-110 disabled:opacity-60"
          >
            {saving ? "Lutfen bekle..." : mode === "login" ? "Giris Yap" : "Kayit Ol"}
          </button>
        </form>
      </section>
    </main>
  );
}
