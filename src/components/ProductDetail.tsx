"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { COLORWAYS, PRODUCTS, formatBRL, installment, type Product, type VariantName } from "@/lib/products";
import { useCart } from "@/components/ui/Cart";
import { ProductCard } from "@/components/ui/ProductCard";

const ProductViewer = dynamic(() => import("@/components/three/ProductViewer").then((m) => m.ProductViewer), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
    </div>
  ),
});

export function ProductDetail({ initial }: { initial: Product }) {
  const [product, setProduct] = useState(initial);
  const [size, setSize] = useState<number | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const { add } = useCart();

  const siblings = PRODUCTS.filter((p) => p.line === product.line);
  const color = COLORWAYS[product.colorway];
  const related = PRODUCTS.filter((p) => p.line !== product.line && p.colorway === product.colorway).slice(0, 3);

  // Mantém a URL sincronizada sem remontar o viewer (não recarrega o GLB).
  useEffect(() => {
    const url = `/produto/${product.slug}`;
    if (window.location.pathname !== url) window.history.replaceState(null, "", url);
  }, [product.slug]);

  const switchColor = (variant: VariantName) => {
    const next = siblings.find((p) => p.colorway === variant);
    if (!next) return;
    setProduct(next);
    if (size !== null && (next.soldOut ?? []).includes(size)) setSize(null);
  };

  const addToCart = () => {
    if (size === null) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    add(product, size);
  };

  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;

  return (
    <div className="mx-auto max-w-7xl px-5 pb-24 pt-24 sm:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-fg-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-fg">
              Início
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li>
            <Link href="/catalogo" className="hover:text-fg">
              Catálogo
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-fg" aria-current="page">
            Boneti {product.line}
          </li>
        </ol>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14">
        {/* viewer */}
        <div
          className="relative aspect-square overflow-hidden rounded-card border border-line lg:sticky lg:top-24 lg:aspect-[5/4] lg:self-start"
          style={{
            background: `radial-gradient(ellipse 70% 60% at 50% 55%, ${color.hex}66 0%, var(--bg-card) 70%)`,
            transition: "background 700ms ease",
          }}
        >
          <ProductViewer variant={product.colorway} className="absolute inset-0" />
          <div className="absolute left-4 top-4 flex gap-2">
            <span className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
              3D · 360°
            </span>
            {product.tag && (
              <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white">
                {product.tag}
              </span>
            )}
          </div>
        </div>

        {/* infos */}
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Linha {product.line}</span>
          <h1 className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Boneti {product.line}
            <AnimatePresence mode="wait">
              <motion.span
                key={product.colorway}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="block text-fg-muted"
              >
                {color.label}
              </motion.span>
            </AnimatePresence>
          </h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold">{formatBRL(product.price)}</span>
            {product.compareAt && (
              <>
                <s className="text-fg-faint">{formatBRL(product.compareAt)}</s>
                <span className="rounded-full bg-accent-2/15 px-2 py-0.5 text-xs font-semibold text-accent-2">-{discount}%</span>
              </>
            )}
          </div>
          <p className="mt-1 text-sm text-fg-muted">
            ou 12x de {installment(product.price)} sem juros · 5% off no Pix
          </p>

          {/* cor */}
          <fieldset className="mt-8">
            <legend className="mb-3 text-xs font-semibold uppercase tracking-widest text-fg-faint">
              Cor — <span className="normal-case tracking-normal text-fg">{color.label}</span>
            </legend>
            <div className="flex gap-3">
              {siblings.map((p) => {
                const c = COLORWAYS[p.colorway];
                const on = p.colorway === product.colorway;
                return (
                  <button
                    key={p.slug}
                    onClick={() => switchColor(p.colorway)}
                    aria-pressed={on}
                    aria-label={c.label}
                    title={c.label}
                    className={`h-11 w-11 rounded-full p-1 transition ring-2 ring-offset-2 ring-offset-bg ${
                      on ? "ring-fg" : "ring-transparent hover:ring-white/30"
                    }`}
                  >
                    <span className="block h-full w-full rounded-full" style={{ background: `linear-gradient(135deg, ${c.hex}, ${c.accent})` }} />
                  </button>
                );
              })}
            </div>
          </fieldset>

          {/* tamanho */}
          <fieldset className="mt-8">
            <legend className="mb-3 flex w-full items-center justify-between text-xs font-semibold uppercase tracking-widest text-fg-faint">
              <span>
                Tamanho{size ? <span className="normal-case tracking-normal text-fg"> — {size}</span> : null}
              </span>
              <button type="button" className="normal-case tracking-normal text-accent underline-offset-4 hover:underline">
                Guia de tamanhos
              </button>
            </legend>
            <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-6">
              {product.sizes.map((s) => {
                const out = (product.soldOut ?? []).includes(s);
                const on = size === s;
                return (
                  <button
                    key={s}
                    disabled={out}
                    onClick={() => {
                      setSize(s);
                      setSizeError(false);
                    }}
                    aria-pressed={on}
                    aria-label={out ? `Tamanho ${s} esgotado` : `Tamanho ${s}`}
                    className={`relative rounded-xl border py-2.5 text-sm tabular-nums transition ${
                      on
                        ? "border-fg bg-fg text-bg"
                        : out
                          ? "cursor-not-allowed border-line text-fg-faint line-through"
                          : "border-line hover:border-white/40"
                    }`}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {sizeError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 text-sm text-accent-2"
                  role="alert"
                >
                  Escolha um tamanho para continuar.
                </motion.p>
              )}
            </AnimatePresence>
          </fieldset>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={addToCart}
              className="flex-1 rounded-full bg-fg py-4 text-sm font-semibold text-bg transition hover:bg-white active:scale-[0.99]"
            >
              Adicionar ao carrinho
            </button>
            <button className="rounded-full border border-white/20 px-6 py-4 text-sm font-semibold transition hover:border-white/50">
              Comprar pelo WhatsApp
            </button>
          </div>

          <ul className="mt-6 grid gap-2 text-sm text-fg-muted sm:grid-cols-3">
            <li className="rounded-xl border border-line px-3 py-2.5">🚚 Envio em 24h</li>
            <li className="rounded-xl border border-line px-3 py-2.5">↩︎ Troca grátis 30 dias</li>
            <li className="rounded-xl border border-line px-3 py-2.5">🔒 Compra protegida</li>
          </ul>

          <div className="mt-10 border-t border-line pt-8">
            <h2 className="font-display text-lg font-semibold">Sobre o modelo</h2>
            <p className="mt-3 leading-relaxed text-fg-muted">{product.description}</p>
            <ul className="mt-5 space-y-2">
              {product.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="relacionados">
          <h2 id="relacionados" className="mb-6 font-display text-2xl font-bold tracking-tight">
            Mesma cor, outras linhas
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
