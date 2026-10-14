"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { COLORWAYS, LINES, PRODUCTS, SIZES, formatBRL, type Line, type Product, type VariantName } from "@/lib/products";
import { ProductCard, ProductCardSkeleton } from "@/components/ui/ProductCard";

type Sort = "relevancia" | "menor-preco" | "maior-preco" | "novidades";

interface Filters {
  lines: Line[];
  colors: VariantName[];
  size: number | null;
  maxPrice: number;
  tag: Product["tag"] | null;
  sort: Sort;
}

const MAX_PRICE = Math.ceil(Math.max(...PRODUCTS.map((p) => p.price)) / 10) * 10;

const EMPTY: Filters = { lines: [], colors: [], size: null, maxPrice: MAX_PRICE, tag: null, sort: "relevancia" };

function applyFilters(f: Filters): Product[] {
  let list = PRODUCTS.filter(
    (p) =>
      (f.lines.length === 0 || f.lines.includes(p.line)) &&
      (f.colors.length === 0 || f.colors.includes(p.colorway)) &&
      (f.size === null || (p.sizes.includes(f.size) && !(p.soldOut ?? []).includes(f.size))) &&
      p.price <= f.maxPrice &&
      (f.tag === null || p.tag === f.tag),
  );
  switch (f.sort) {
    case "menor-preco":
      list = [...list].sort((a, b) => a.price - b.price);
      break;
    case "maior-preco":
      list = [...list].sort((a, b) => b.price - a.price);
      break;
    case "novidades":
      list = [...list].sort((a, b) => Number(b.tag === "Novo") - Number(a.tag === "Novo"));
      break;
  }
  return list;
}

function toggle<T>(arr: T[], v: T): T[] {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}

export function Catalog() {
  const params = useSearchParams();
  const router = useRouter();
  const [filters, setFilters] = useState<Filters>(() => ({
    ...EMPTY,
    tag: (params.get("tag") as Product["tag"]) ?? null,
  }));
  const [loading, setLoading] = useState(false);
  const deferred = useDeferredValue(filters);

  // Sincroniza ?tag= vindo da navbar/rodapé (padrão "ajustar estado durante o render").
  const urlTag = (params.get("tag") as Product["tag"]) ?? null;
  const [seenTag, setSeenTag] = useState(urlTag);
  if (urlTag !== seenTag) {
    setSeenTag(urlTag);
    setFilters((f) => ({ ...f, tag: urlTag }));
  }

  /** Atualiza filtros e simula latência de rede para evidenciar o loading (trocar por fetch real). */
  const update = (next: Filters) => {
    setFilters(next);
    setLoading(true);
  };
  useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 260);
    return () => clearTimeout(t);
  }, [loading, deferred]);

  const results = useMemo(() => applyFilters(deferred), [deferred]);
  const active =
    filters.lines.length + filters.colors.length + (filters.size ? 1 : 0) + (filters.maxPrice < MAX_PRICE ? 1 : 0) + (filters.tag ? 1 : 0);

  const clear = () => {
    setFilters(EMPTY);
    router.replace("/catalogo");
  };

  const chip = (on: boolean) =>
    `rounded-full border px-3.5 py-1.5 text-sm transition ${
      on ? "border-fg bg-fg text-bg" : "border-line text-fg-muted hover:border-white/30 hover:text-fg"
    }`;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Catálogo</span>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight sm:text-5xl">Todos os tênis</h1>
        </div>
        <p className="text-sm text-fg-muted" aria-live="polite">
          {loading ? "Atualizando…" : `${results.length} ${results.length === 1 ? "modelo" : "modelos"}`}
        </p>
      </header>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        {/* filtros */}
        <aside className="space-y-7 lg:sticky lg:top-24 lg:self-start" aria-label="Filtros">
          <FilterGroup title="Linha">
            <div className="flex flex-wrap gap-2">
              {LINES.map((l) => (
                <button key={l} className={chip(filters.lines.includes(l))} onClick={() => update({ ...filters, lines: toggle(filters.lines, l) })} aria-pressed={filters.lines.includes(l)}>
                  {l}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Cor">
            <div className="flex flex-wrap gap-2">
              {(Object.values(COLORWAYS)).map((c) => {
                const on = filters.colors.includes(c.variant);
                return (
                  <button
                    key={c.variant}
                    className={`${chip(on)} flex items-center gap-2`}
                    onClick={() => update({ ...filters, colors: toggle(filters.colors, c.variant) })}
                    aria-pressed={on}
                  >
                    <span className="h-3 w-3 rounded-full ring-1 ring-white/30" style={{ background: c.hex }} />
                    {c.label.split(" ")[1]}
                  </button>
                );
              })}
            </div>
          </FilterGroup>

          <FilterGroup title="Tamanho">
            <div className="grid grid-cols-6 gap-1.5">
              {SIZES.map((s) => (
                <button
                  key={s}
                  className={`rounded-lg border py-1.5 text-sm tabular-nums transition ${
                    filters.size === s ? "border-fg bg-fg text-bg" : "border-line text-fg-muted hover:border-white/30 hover:text-fg"
                  }`}
                  onClick={() => update({ ...filters, size: filters.size === s ? null : s })}
                  aria-pressed={filters.size === s}
                >
                  {s}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title={`Até ${formatBRL(filters.maxPrice)}`}>
            <input
              type="range"
              min={200}
              max={MAX_PRICE}
              step={10}
              value={filters.maxPrice}
              onChange={(e) => update({ ...filters, maxPrice: Number(e.target.value) })}
              className="w-full accent-[var(--accent)]"
              aria-label="Preço máximo"
            />
          </FilterGroup>

          <FilterGroup title="Destaque">
            <div className="flex flex-wrap gap-2">
              {(["Novo", "Oferta", "Mais vendido"] as const).map((t) => (
                <button key={t} className={chip(filters.tag === t)} onClick={() => update({ ...filters, tag: filters.tag === t ? null : t })} aria-pressed={filters.tag === t}>
                  {t}
                </button>
              ))}
            </div>
          </FilterGroup>

          {active > 0 && (
            <button onClick={clear} className="text-sm text-accent underline-offset-4 hover:underline">
              Limpar {active} {active === 1 ? "filtro" : "filtros"}
            </button>
          )}
        </aside>

        {/* grid */}
        <div>
          <div className="mb-5 flex items-center justify-end gap-3 text-sm">
            <label htmlFor="sort" className="text-fg-muted">
              Ordenar
            </label>
            <select
              id="sort"
              value={filters.sort}
              onChange={(e) => update({ ...filters, sort: e.target.value as Sort })}
              className="rounded-full border border-line bg-bg-card px-4 py-2 text-fg outline-none focus:border-accent"
            >
              <option value="relevancia">Relevância</option>
              <option value="novidades">Novidades</option>
              <option value="menor-preco">Menor preço</option>
              <option value="maior-preco">Maior preço</option>
            </select>
          </div>

          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" aria-busy>
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-line px-6 py-24 text-center">
              <div className="mb-3 text-4xl">🔍</div>
              <h2 className="font-display text-xl font-semibold">Nenhum modelo com esses filtros</h2>
              <p className="mt-2 max-w-sm text-sm text-fg-muted">
                Tente remover o tamanho ou aumentar o preço máximo. Também avisamos quando um tamanho esgotado voltar.
              </p>
              <button onClick={clear} className="mt-6 rounded-full bg-fg px-6 py-2.5 text-sm font-semibold text-bg hover:bg-white">
                Limpar filtros
              </button>
            </div>
          ) : (
            <motion.ul layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {results.map((p, i) => (
                  <motion.li
                    key={p.slug}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    <ProductCard product={p} priority={i < 3} />
                  </motion.li>
                ))}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-fg-faint">{title}</legend>
      {children}
    </fieldset>
  );
}
