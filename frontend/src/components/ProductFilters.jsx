const pricePresets = [
  { label: "Tüm", value: "" },
  { label: "0 - 500", value: "0-500" },
  { label: "500 - 1500", value: "500-1500" },
  { label: "1500 - 3000", value: "1500-3000" },
  { label: "3000+", value: "3000-100000" },
];

export default function ProductFilters({
  categories,
  selectedCategory,
  selectedPrice,
  onCategoryChange,
  onPriceChange,
}) {
  return (
    <section className="rounded-[1.75rem] border border-white/10 bg-zinc-950/70 p-4 shadow-[0_20px_80px_rgba(0,0,0,0.22)] backdrop-blur-xl">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-black tracking-tight text-zinc-100">Kategoriler</h2>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-zinc-400">
          Filtreler
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-4">
          <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Kategori</label>
          <select
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-rose-500"
          >
            <option value="">Tüm kategoriler</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2 rounded-2xl border border-white/5 bg-white/5 p-4">
          <label className="block text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Fiyat</label>
          <select
            value={selectedPrice}
            onChange={(event) => onPriceChange(event.target.value)}
            className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-rose-500"
          >
            {pricePresets.map((price) => (
              <option key={price.label} value={price.value}>
                {price.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
