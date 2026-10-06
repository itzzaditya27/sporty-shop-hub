import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import hero from "@/assets/hero.jpg";
import tee from "@/assets/tee.jpg";
import shorts from "@/assets/shorts.jpg";
import cap from "@/assets/cap.jpg";
import crew from "@/assets/crew.jpg";
import duffel from "@/assets/duffel.jpg";
import socks from "@/assets/socks.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Meridian — Running & Court Gear" },
      { name: "description", content: "Small-batch running and court gear with a live stockroom." },
      { property: "og:title", content: "Meridian — Running & Court Gear" },
      { property: "og:description", content: "Small-batch running and court gear with a live stockroom." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Product = { id: number; name: string; desc: string; cat: string; price: number; stock: number; reorder: number; img: string };

const seed: Product[] = [
  { id: 1, name: "Pace Crew Tee", desc: "Merino-blend, 140gsm", cat: "Running", price: 68, stock: 42, reorder: 15, img: tee },
  { id: 2, name: 'Split Short 5"', desc: "Ripstop shell, zip pocket", cat: "Running", price: 84, stock: 28, reorder: 20, img: shorts },
  { id: 3, name: "Baseline Cap", desc: "Washed cotton twill", cat: "Court", price: 42, stock: 6, reorder: 12, img: cap },
  { id: 4, name: "Warmup Crew", desc: "Brushed lambswool", cat: "Recovery", price: 120, stock: 19, reorder: 10, img: crew },
  { id: 5, name: "Two-Racket Duffel", desc: "Waxed canvas, 30L", cat: "Court", price: 156, stock: 4, reorder: 8, img: duffel },
  { id: 6, name: "Long Run Sock 3-pack", desc: "Merino cushion, ankle", cat: "Running", price: 34, stock: 73, reorder: 25, img: socks },
];
const cats = ["All", "Running", "Court", "Recovery"];
const pill = "text-xs px-4 py-1.5 rounded-full transition-all";
const ghost = "ring-1 ring-ink/10 text-ink/70 hover:ring-ink/25";
const input = "w-full text-sm px-3 py-2 rounded-lg bg-panel ring-1 ring-ink/10 placeholder:text-ink/40 outline-none focus:ring-moss";

function Index() {
  const [products, setProducts] = useState(seed);
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState<Record<number, number>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [form, setForm] = useState({ name: "", cat: "Running", price: "", stock: "" });

  const shown = cat === "All" ? products : products.filter((p) => p.cat === cat);
  const low = products.filter((p) => p.stock < p.reorder);
  const cartItems = Object.entries(cart).map(([id, q]) => ({ p: products.find((x) => x.id === +id)!, q })).filter((c) => c.p);
  const count = cartItems.reduce((s, c) => s + c.q, 0);
  const total = useMemo(() => cartItems.reduce((s, c) => s + c.q * c.p.price, 0), [cartItems]);

  const addToCart = (p: Product) => {
    if ((cart[p.id] ?? 0) >= p.stock) return;
    setCart((c) => ({ ...c, [p.id]: (c[p.id] ?? 0) + 1 }));
  };
  const setStock = (id: number, stock: number) =>
    setProducts((ps) => ps.map((p) => (p.id === id ? { ...p, stock: Math.max(0, stock) } : p)));
  const checkout = () => {
    setProducts((ps) => ps.map((p) => ({ ...p, stock: p.stock - (cart[p.id] ?? 0) })));
    setCart({});
    setCartOpen(false);
  };
  const addProduct = () => {
    if (!form.name || !form.price) return;
    setProducts((ps) => [
      ...ps,
      { id: Date.now(), name: form.name, desc: "New arrival", cat: form.cat, price: +form.price, stock: +form.stock || 0, reorder: 10, img: tee },
    ]);
    setForm({ name: "", cat: "Running", price: "", stock: "" });
  };
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="min-h-screen bg-cream text-ink">
      <header className="sticky top-0 z-30 bg-cream/85 backdrop-blur-sm">
        <div className="mx-auto max-w-[92rem] px-6 sm:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span className="font-display italic font-medium text-2xl tracking-tight">Meridian</span>
            <nav className="hidden md:flex gap-7 text-sm font-medium text-ink/70">
              <button onClick={() => scrollTo("store")} className="hover:text-ink">Store</button>
              <button onClick={() => scrollTo("stockroom")} className="hover:text-ink">Stockroom</button>
            </nav>
          </div>
          <button onClick={() => setCartOpen(true)} className="text-sm font-medium px-4 py-2 rounded-full bg-ink text-cream hover:opacity-90 flex items-center gap-2">
            <span className="size-2 rounded-full bg-flame" /> Cart · {count}
          </button>
        </div>
      </header>

      <section className="overflow-hidden">
        <div className="mx-auto max-w-[92rem] px-6 sm:px-10 py-16 sm:py-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 order-2 lg:order-1 animate-rise">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-moss">Spring / Summer · Vol. 04</p>
            <h1 className="mt-5 font-display font-light text-balance text-5xl sm:text-6xl xl:text-7xl leading-[0.98] max-w-[12ch]">
              Kit for the <span className="italic text-moss">long</span> run.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-ink/70 max-w-[48ch]">
              Small-batch running and court gear, cut for distance and finished for the clubhouse. Built to last, restocked weekly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => scrollTo("store")} className="text-sm font-semibold px-6 py-2.5 rounded-full bg-ink text-cream hover:opacity-90">Shop the drop</button>
              <button onClick={() => scrollTo("stockroom")} className={`text-sm font-medium px-6 py-2.5 rounded-full ${ghost}`}>View stockroom</button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-8 text-xs font-medium text-ink/50">
              <span>Free shipping over $95</span><span className="h-3 w-px bg-line" />
              <span>30-day wear test</span><span className="h-3 w-px bg-line" />
              <span>Carbon-neutral returns</span>
            </div>
          </div>
          <div className="lg:col-span-5 order-1 lg:order-2 relative">
            <div className="absolute -inset-x-10 -inset-y-8 -rotate-6 rounded-[28px] bg-moss/10 ring-1 ring-ink/5 animate-drift-slow" />
            <div className="absolute -inset-4 rotate-3 rounded-[24px] bg-sage/15 ring-1 ring-ink/5 animate-drift" />
            <img src={hero} alt="Runner on a coastal path at golden hour" width={912} height={1104} className="relative rounded-[24px] aspect-[9/11] w-full object-cover" />
            <div className="absolute -bottom-5 left-6 rounded-xl bg-panel ring-1 ring-ink/5 px-4 py-3 animate-rise">
              <p className="text-[11px] uppercase tracking-[0.15em] text-ink/50">On the shelf</p>
              <p className="text-sm font-semibold text-moss mt-0.5">{products[0].name} · {products[0].stock} left</p>
            </div>
          </div>
        </div>
      </section>

      <section id="store" className="border-t border-line scroll-mt-16">
        <div className="mx-auto max-w-[92rem] px-6 sm:px-10 py-14 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display font-light text-3xl sm:text-4xl">The storefront</h2>
              <p className="mt-2 text-sm text-ink/60 max-w-[46ch]">Filter by discipline. Every item below is live against the stockroom.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {cats.map((c) => (
                <button key={c} onClick={() => setCat(c)} className={`${pill} ${cat === c ? "bg-ink text-cream font-semibold" : `${ghost} font-medium`}`}>{c}</button>
              ))}
            </div>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {shown.map((p) => {
              const out = p.stock - (cart[p.id] ?? 0) <= 0;
              return (
                <div key={p.id} className="group animate-rise">
                  <div className="relative rounded-[18px] overflow-hidden bg-sage/15">
                    <img src={p.img} alt={p.name} loading="lazy" width={816} height={816} className="w-full aspect-square object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-moss bg-panel/90 px-2.5 py-1 rounded-full">{p.cat}</span>
                    {p.stock === 0 ? (
                      <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-flame bg-panel/90 px-2.5 py-1 rounded-full">Sold out</span>
                    ) : p.stock < p.reorder && (
                      <span className="absolute top-3 right-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-flame bg-panel/90 px-2.5 py-1 rounded-full">Low stock</span>
                    )}
                  </div>
                  <div className="mt-4 flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display font-medium text-lg leading-tight">{p.name}</h3>
                      <p className="text-sm text-ink/60 mt-1">{p.desc}</p>
                    </div>
                    <p className="text-sm font-semibold">${p.price}</p>
                  </div>
                  <button disabled={out} onClick={() => addToCart(p)} className="mt-3 w-full text-sm font-medium py-2 rounded-full ring-1 ring-ink/10 hover:ring-ink/30 hover:bg-panel transition-all disabled:opacity-40 disabled:pointer-events-none">
                    {out ? "Unavailable" : "Add to cart"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="stockroom" className="border-t border-line bg-stock scroll-mt-16">
        <div className="mx-auto max-w-[92rem] px-6 sm:px-10 py-14 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-moss">Internal</p>
          <h2 className="mt-2 font-display font-light text-3xl sm:text-4xl">The stockroom</h2>
          <div className="mt-8 grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 rounded-[20px] bg-panel ring-1 ring-ink/5 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-line">
                <h3 className="text-sm font-semibold">Live inventory</h3>
                <span className="text-xs font-medium text-ink/50">{products.length} SKUs · {products.reduce((s, p) => s + p.stock, 0)} units</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/50 border-b border-line">
                      <th className="px-6 py-3">Product</th><th className="px-4 py-3">Discipline</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">On hand</th><th className="px-4 py-3">Reorder</th><th className="px-6 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-ink/80">
                    {products.map((p) => {
                      const isLow = p.stock < p.reorder;
                      return (
                        <tr key={p.id} className="border-b border-line/70 last:border-0 hover:bg-cream/60 transition-colors">
                          <td className="px-6 py-3 font-medium">{p.name}</td>
                          <td className="px-4 py-3">{p.cat}</td>
                          <td className="px-4 py-3 tabular-nums">${p.price}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <button onClick={() => setStock(p.id, p.stock - 1)} className="size-6 rounded-full ring-1 ring-ink/10 hover:bg-cream">−</button>
                              <input type="number" value={p.stock} onChange={(e) => setStock(p.id, +e.target.value)} className="w-12 text-center tabular-nums bg-transparent outline-none" />
                              <button onClick={() => setStock(p.id, p.stock + 1)} className="size-6 rounded-full ring-1 ring-ink/10 hover:bg-cream">+</button>
                            </div>
                          </td>
                          <td className="px-4 py-3 tabular-nums">{p.reorder}</td>
                          <td className="px-6 py-3">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${isLow ? "text-flame" : "text-moss"}`}>
                              <span className={`size-1.5 rounded-full ${isLow ? "bg-flame" : "bg-moss"}`} />{p.stock === 0 ? "Out" : isLow ? "Low" : "Healthy"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-4 rounded-[20px] bg-panel ring-1 ring-ink/5 overflow-hidden">
              <div className="px-6 py-4 border-b border-line flex items-center justify-between">
                <h3 className="text-sm font-semibold">Low-stock alerts</h3>
                <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-flame">{low.length} active</span>
              </div>
              <div className="px-6 py-5 space-y-5">
                {low.length === 0 && <p className="text-sm text-ink/60">All stock is healthy.</p>}
                {low.map((p) => (
                  <div key={p.id} className="flex items-start gap-3 pb-5 border-b border-line">
                    <span className="mt-1 size-2 rounded-full bg-flame shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-ink/60 mt-0.5">{p.stock} on hand · below reorder of {p.reorder}</p>
                      <button onClick={() => setStock(p.id, p.stock + p.reorder * 2)} className="mt-2 text-xs font-semibold text-moss hover:text-ink">Reorder now →</button>
                    </div>
                  </div>
                ))}
                <div className="rounded-xl bg-cream ring-1 ring-ink/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-ink/50">Add a product</p>
                  <div className="mt-3 space-y-2">
                    <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={input} />
                    <select value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })} className={input}>
                      {cats.slice(1).map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className={input} />
                      <input type="number" placeholder="On hand" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className={input} />
                    </div>
                    <button onClick={addProduct} className="w-full text-sm font-semibold py-2 rounded-lg bg-ink text-cream hover:opacity-90">Save to stockroom</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-line">
        <div className="mx-auto max-w-[92rem] px-6 sm:px-10 py-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="font-display italic font-medium text-xl">Meridian</span>
          <p className="text-sm text-ink/50">Made in small batches</p>
        </div>
      </footer>

      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setCartOpen(false)} />
          <aside className="relative w-full max-w-md h-full bg-panel p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl">Your cart</h2>
              <button onClick={() => setCartOpen(false)} className="text-sm text-ink/60 hover:text-ink">Close</button>
            </div>
            <div className="mt-6 flex-1 overflow-y-auto space-y-4">
              {cartItems.length === 0 && <p className="text-sm text-ink/60">Your cart is empty.</p>}
              {cartItems.map(({ p, q }) => (
                <div key={p.id} className="flex gap-4 items-center">
                  <img src={p.img} alt={p.name} className="size-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-display">{p.name}</p>
                    <p className="text-xs text-ink/60">${p.price} × {q}</p>
                  </div>
                  <button onClick={() => setCart((c) => { const n = { ...c }; delete n[p.id]; return n; })} className="text-xs text-flame">Remove</button>
                </div>
              ))}
            </div>
            <div className="border-t border-line pt-4">
              <div className="flex justify-between font-semibold"><span>Total</span><span>${total}</span></div>
              <button disabled={!count} onClick={checkout} className="mt-4 w-full py-3 rounded-full bg-ink text-cream font-semibold disabled:opacity-40">Checkout</button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
