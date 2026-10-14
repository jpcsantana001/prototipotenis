"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  CATEGORIES,
  PRODUCTS,
  SNEAKER_LINES,
  STREET_BRANDS,
  SUB_LABELS,
  formatBRL,
  sizesFor,
  type Category,
  type Product,
} from "@/lib/catalog";
import { ProductCard, ProductCardSkeleton } from "@/components/ui/ProductCard";

type Sort = "relevancia" | "menor-preco" | "maior-preco" | "desconto";
const PAGE = 24;

interface Filters {
  cat: Category | null;
  sub: string | null;
  size: string | null;
  promo: boolean;
  available: boolean;
  max: number | null;
  q: string;
  sort: Sort;
}

function parse(sp: URLSearchParams): Filters {
  return {
    cat: (sp.get("cat") as Category) || null,
    sub: sp.get("sub"),
    size: sp.get("tam"),
    promo: sp.get("promo") === "1",
    available: sp.get("disp") === "1",
    max: sp.get("max") ? Number(sp.get("max")) : null,
    q: sp.get("q") ?? "",
    sort: (sp.get("ord") as Sort) || "relevancia",
  };
}

function serialize(f: Filters): string {
  const sp = new URLSearchParams();
  if (f.cat) sp.set("cat", f.cat);
  if (f.sub) sp.set("sub", f.sub);
  if (f.size) sp.set("tam", f.size);
  if (f.promo) sp.set("promo", "1");
  if (f.available) sp.set("disp", "1");
  if (f.max) sp.set("max", String(f.max));
  if (f.q) sp.set("q", f.q);
  if (f.sort !== "relevancia") sp.set("ord", f.sort);
  const s = sp.toString();
  return s ? `?${s}` : "";
}

function apply(f: Filters): Product[] {
  const q = f.q.trim().toLowerCase();
  let list = PRODUCTS.filter(
    (p) =>
      (!f.cat || p.category === f.cat) &&
      (!f.sub || p.subs.includes(f.sub)) &&
      (!f.size || p.sizes.some((s) => s.label === f.size && s.available)) &&
      (!f.promo || p.discount > 0 || p.promo) &&
      (!f.available || p.available) &&
      (!f.max || p.price <= f.max) &&
      (!q || p.title.toLowerCase().includes(q) || p.subs.some((s) => (SUB_LABELS[s] ?? s).toLowerCase().includes(q))),
  );
  switch (f.sort) {
    case "menor-preco":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "maior-preco":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "desconto":
      list = [...list].sort((a, b) => b.discount - a.discount);
      break;
    default:
      // relevância: disponíveis primeiro, depois ordem original (mais recentes no topo)
      list = [...list].sort((a, b) => Number(b.available) - Number(a.available));
  }
  return list;
}

const PRICE_STEPS = [100, 200, 300, 500, 700];

export function Catalog() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useMemo(() => parse(new URLSearchParams(sp.toString())), [sp]);
  const deferred = useDeferredValue(filters);
  const [limit, setLimit] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState(filters.q);

  const set = (patch: Partial<Filters>) => {
    setLoading(true);
    setLimit(PAGE);
    router.replace(`${pathname}${serialize({ ...filters, ...patch })}`, { scroll: false });
  };

  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 220);
    return () => clearTimeout(t);
  }, [loading, deferred]);

  // busca com debounce
  useEffect(() => {
    if (q === filters.q) return;
    const t = setTimeout(() => set({ q }), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const results = useMemo(() => apply(deferred), [deferred]);
  const visible = results.slice(0, limit);

  const subsForCat = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of PRODUCTS) {
      if (filters.cat && p.category !== filters.cat) continue;
      for (const s of p.subs) counts[s] = (counts[s] ?? 0) + 1;
    }
    const order = [...SNEAKER_LINES, ...STREET_BRANDS, "premium", "oversized", "calca-jeans", "calca-baggy", "calca-moletom", "camisetas-dri-fit"];
    return order.filter((s) => counts[s] && SUB_LABELS[s]).map((s) => ({ key: s, label: SUB_LABELS[s], n: counts[s] }));
  }, [filters.cat]);

  const sizes = useMemo(() => sizesFor(filters.cat), [filters.cat]);
  const catLabel = CATEGORIES.find((c) => c.key === filters.cat)?.label;
  const active = [filters.cat, filters.sub, filters.size, filters.promo, filters.available, filters.max, filters.q].filter(Boolean).length;

  const chip = (on: boolean, extra = "") =>
    `rounded-sm border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
      on ? "border-accent bg-accent text-accent-ink" : "border-line text-fg-muted hover:border-white/40 hover:text-fg"
    } ${extra}`;

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-32 sm:px-8">
      {/* cabeçalho */}
      <header className="mb-6">
        <nav className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 pb-4 sm:mx-0 sm:flex-wrap sm:px-0" aria-label="Categorias">
          <button className={chip(!filters.cat)} onClick={() => set({ cat: null, sub: null, size: null })}>
            Tudo
          </button>
          {CATEGORIES.map((c) => (
            <button key={c.key} className={chip(filters.cat === c.key, "shrink-0")} onClick={() => set({ cat: c.key, sub: null, size: null })} aria-pressed={filters.cat === c.key}>
              {c.label}
            </button>
          ))}
        </nav>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h1 className="display text-6xl sm:text-8xl">
            {filters.sub ? SUB_LABELS[filters.sub] ?? filters.sub : filters.promo ? "Até 50% off" : catLabel ?? "Catálogo"}
            {filters.sub && catLabel ? <span className="block text-2xl text-fg-muted sm:text-3xl">{catLabel}</span> : null}
          </h1>
          <p className="text-sm text-fg-muted" aria-live="polite">
            {loading ? "Atualizando…" : `${results.length} ${results.length === 1 ? "produto" : "produtos"}`}
          </p>
        </div>
      </header>

      <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
        {/* filtros */}
        <aside className="space-y-7 lg:sticky lg:top-28 lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2" aria-label="Filtros">
          <label className="block">
            <span className="sr-only">Buscar</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar: air max, corteiz, 42…"
              className="w-full rounded-sm border border-line bg-bg-card px-3.5 py-2.5 text-sm outline-none placeholder:text-fg-faint focus:border-accent"
            />
          </label>

          {subsForCat.length > 0 && (
            <Group title={filters.cat === "tenis" ? "Modelo / marca" : "Marca / linha"}>
              <div className="flex flex-wrap gap-1.5">
                {subsForCat.map((s) => (
                  <button key={s.key} className={chip(filters.sub === s.key)} onClick={() => set({ sub: filters.sub === s.key ? null : s.key })} aria-pressed={filters.sub === s.key}>
                    {s.label} <span className="opacity-60">{s.n}</span>
                  </button>
                ))}
              </div>
            </Group>
          )}

          {sizes.length > 0 && (
            <Group title="Tamanho (em estoque)">
              <div className="grid grid-cols-5 gap-1.5">
                {sizes.map((s) => (
                  <button
                    key={s}
                    className={`rounded-sm border py-1.5 text-xs font-semibold tabular-nums transition ${
                      filters.size === s ? "border-accent bg-accent text-accent-ink" : "border-line text-fg-muted hover:border-white/40 hover:text-fg"
                    }`}
                    onClick={() => set({ size: filters.size === s ? null : s })}
                    aria-pressed={filters.size === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </Group>
          )}

          <Group title="Preço até">
            <div className="flex flex-wrap gap-1.5">
              {PRICE_STEPS.map((v) => (
                <button key={v} className={chip(filters.max === v)} onClick={() => set({ max: filters.max === v ? null : v })} aria-pressed={filters.max === v}>
                  {formatBRL(v)}
                </button>
              ))}
            </div>
          </Group>

          <Group title="Mais">
            <div className="flex flex-wrap gap-1.5">
              <button className={chip(filters.promo)} onClick={() => set({ promo: !filters.promo })} aria-pressed={filters.promo}>
                Em promoção
              </button>
              <button className={chip(filters.available)} onClick={() => set({ available: !filters.available })} aria-pressed={filters.available}>
                Só em estoque
              </button>
            </div>
          </Group>

          {active > 0 && (
            <button onClick={() => { setQ(""); router.replace(pathname, { scroll: false }); setLimit(PAGE); }} className="text-xs font-semibold uppercase tracking-wider text-accent underline-offset-4 hover:underline">
              Limpar {active} {active === 1 ? "filtro" : "filtros"}
            </button>
          )}
        </aside>

        {/* grid */}
        <div>
          <div className="mb-4 flex items-center justify-end gap-3 text-sm">
            <label htmlFor="sort" className="text-fg-muted">
              Ordenar
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => set({ sort: e.target.value as Sort })}
              className="rounded-sm border border-line bg-bg-card px-3 py-2 text-fg outline-none focus:border-accent"
            >
              <option value="relevancia">Relevância</option>
              <option value="desconto">Maior desconto</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4" aria-busy>
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line px-6 py-24 text-center">
              <p className="display text-4xl">Nada por aqui</p>
              <p className="mt-2 max-w-sm text-sm text-fg-muted">Tente outro tamanho, tire o limite de preço ou busque por outro termo.</p>
              <button onClick={() => { setQ(""); router.replace(pathname, { scroll: false }); }} className="display mt-6 rounded-sm bg-accent px-6 py-2.5 text-xl text-accent-ink">
                Limpar filtros
              </button>
            </div>
          ) : (
            <>
              <motion.ul layout className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                <AnimatePresence mode="popLayout">
                  {visible.map((p, i) => (
                    <motion.li key={p.handle} layout initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.25, delay: Math.min(i, 12) * 0.02 }}>
                      <ProductCard product={p} priority={i < 4} />
                    </motion.li>
                  ))}
                </AnimatePresence>
              </motion.ul>
              {visible.length < results.length && (
                <div className="mt-10 flex flex-col items-center gap-3">
                  <p className="text-xs text-fg-muted">
                    Mostrando {visible.length} de {results.length}
                  </p>
                  <button onClick={() => setLimit((l) => l + PAGE)} className="display rounded-sm border border-white/30 px-8 py-3 text-xl transition hover:border-accent hover:text-accent">
                    Carregar mais
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-2.5 text-[10px] font-bold uppercase tracking-[0.25em] text-fg-faint">{title}</legend>
      {children}
    </fieldset>
  );
}
