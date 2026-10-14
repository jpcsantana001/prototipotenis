"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CATEGORIES, PRODUCTS, SUB_LABELS, formatBRL, img, installment, type Product } from "@/lib/catalog";
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

const WHATSAPP = "5545991422244";

export function ProductDetail({ product }: { product: Product }) {
  const [size, setSize] = useState<string | null>(product.sizes.length === 0 ? "" : null);
  const [sizeError, setSizeError] = useState(false);
  const [mode, setMode] = useState<"foto" | "3d">("foto");
  const [photo, setPhoto] = useState(0);
  const [broken, setBroken] = useState<Record<number, boolean>>({});
  const { add } = useCart();

  const cat = CATEGORIES.find((c) => c.key === product.category);
  const line = product.subs.find((s) => SUB_LABELS[s]);
  const related = PRODUCTS.filter((p) => p.handle !== product.handle && (line ? p.subs.includes(line) : p.category === product.category) && p.available).slice(0, 4);

  const addToCart = () => {
    if (size === null) {
      setSizeError(true);
      return;
    }
    setSizeError(false);
    add(product, size);
  };

  const waText = encodeURIComponent(`Oi! Tenho interesse no ${product.title}${size ? ` (tam. ${size})` : ""} — ${formatBRL(product.price)}.`);

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 pt-28 sm:px-8">
      <nav aria-label="Breadcrumb" className="mb-5 text-xs uppercase tracking-wider text-fg-muted">
        <ol className="flex flex-wrap gap-2">
          <li><Link href="/" className="hover:text-fg">Início</Link></li>
          <li aria-hidden>/</li>
          <li><Link href={`/catalogo?cat=${product.category}`} className="hover:text-fg">{cat?.label}</Link></li>
          {line && (
            <>
              <li aria-hidden>/</li>
              <li><Link href={`/catalogo?cat=${product.category}&sub=${line}`} className="hover:text-fg">{SUB_LABELS[line]}</Link></li>
            </>
          )}
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14">
        {/* mídia */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card border border-line bg-bg-card sm:aspect-square">
            {mode === "3d" && product.has3d ? (
              <>
                <div className="glow absolute inset-0" aria-hidden />
                <ProductViewer variant="Street" className="absolute inset-0" />
                <p className="absolute left-3 top-3 rounded-sm bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
                  Demo 3D · modelo ilustrativo
                </p>
              </>
            ) : broken[photo] || !product.images[photo] ? (
              <div className="flex h-full items-center justify-center">
                <span className="display text-6xl text-white/10">{product.category}</span>
              </div>
            ) : (
              <Image
                key={photo}
                src={img(product.images[photo], 1400)}
                alt={product.title}
                fill
                priority
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
                onError={() => setBroken((b) => ({ ...b, [photo]: true }))}
              />
            )}
            {product.discount > 0 && mode === "foto" && (
              <span className="sticker display absolute right-4 top-4 rounded-sm bg-accent-2 px-3 py-1 text-2xl text-white">-{product.discount}%</span>
            )}
          </div>

          {/* miniaturas + toggle 3D */}
          <div className="mt-3 flex items-center gap-2">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => { setMode("foto"); setPhoto(i); }}
                aria-label={`Foto ${i + 1}`}
                aria-pressed={mode === "foto" && photo === i}
                className={`relative h-16 w-14 overflow-hidden rounded-sm border bg-bg-card ${mode === "foto" && photo === i ? "border-accent" : "border-line hover:border-white/40"}`}
              >
                {!broken[i] && <Image src={img(src, 200)} alt="" fill sizes="56px" className="object-cover" onError={() => setBroken((b) => ({ ...b, [i]: true }))} />}
              </button>
            ))}
            {product.has3d && (
              <button
                onClick={() => setMode(mode === "3d" ? "foto" : "3d")}
                aria-pressed={mode === "3d"}
                className={`display ml-auto rounded-sm border px-4 py-2 text-lg transition ${mode === "3d" ? "border-accent bg-accent text-accent-ink" : "border-white/30 hover:border-accent hover:text-accent"}`}
              >
                {mode === "3d" ? "Ver fotos" : "Ver em 3D"}
              </button>
            )}
          </div>
          {product.has3d && (
            <p className="mt-2 text-[11px] text-fg-faint">
              O 3D desta demonstração usa um modelo genérico. Na versão final, cada SKU recebe seu próprio modelo (fotogrametria), com as cores reais.
            </p>
          )}
        </div>

        {/* infos */}
        <div>
          {line && (
            <Link href={`/catalogo?sub=${line}`} className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent hover:underline">
              {SUB_LABELS[line]}
            </Link>
          )}
          <h1 className="display mt-1 text-4xl sm:text-5xl">
            {product.name}
            {product.variantLabel && <span className="block text-fg-muted">{product.variantLabel}</span>}
          </h1>

          <div className="mt-5 flex items-baseline gap-3">
            <span className="display text-4xl">{formatBRL(product.price)}</span>
            {product.compareAt && <s className="text-fg-faint">{formatBRL(product.compareAt)}</s>}
          </div>
          <p className="mt-1 text-sm text-fg-muted">ou 12x de {installment(product.price)} sem juros · 5% off no Pix</p>

          {product.sizes.length > 0 && (
            <fieldset className="mt-8">
              <legend className="mb-3 flex w-full items-center justify-between text-[10px] font-bold uppercase tracking-[0.25em] text-fg-faint">
                <span>
                  Tamanho{size ? <span className="ml-2 text-fg">{size}</span> : null}
                </span>
                <button type="button" className="text-accent underline-offset-4 hover:underline">
                  Guia de tamanhos
                </button>
              </legend>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const on = size === s.label;
                  return (
                    <button
                      key={s.label}
                      disabled={!s.available}
                      onClick={() => { setSize(s.label); setSizeError(false); }}
                      aria-pressed={on}
                      aria-label={s.available ? `Tamanho ${s.label}` : `Tamanho ${s.label} esgotado`}
                      className={`min-w-12 rounded-sm border px-3 py-2.5 text-sm font-semibold tabular-nums transition ${
                        on ? "border-accent bg-accent text-accent-ink" : s.available ? "border-line hover:border-white/50" : "cursor-not-allowed border-line text-fg-faint line-through"
                      }`}
                    >
                      {s.label}
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {sizeError && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="mt-3 text-sm text-accent-2" role="alert">
                    Escolha um tamanho para continuar.
                  </motion.p>
                )}
              </AnimatePresence>
            </fieldset>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={addToCart}
              disabled={!product.available}
              className="display flex-1 rounded-sm bg-accent py-4 text-2xl text-accent-ink transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {product.available ? "Adicionar ao carrinho" : "Esgotado"}
            </button>
            <a
              href={`https://wa.me/${WHATSAPP}?text=${waText}`}
              target="_blank"
              rel="noreferrer"
              className="display rounded-sm border border-white/30 px-6 py-4 text-center text-2xl transition hover:border-accent hover:text-accent"
            >
              WhatsApp
            </a>
          </div>

          <ul className="mt-6 grid gap-2 text-xs text-fg-muted sm:grid-cols-3">
            <li className="rounded-sm border border-line px-3 py-2.5">Envio em 24h</li>
            <li className="rounded-sm border border-line px-3 py-2.5">Troca grátis 30 dias</li>
            <li className="rounded-sm border border-line px-3 py-2.5">Compra protegida</li>
          </ul>

          <div className="mt-10 border-t border-line pt-8 text-sm text-fg-muted">
            <h2 className="display text-2xl text-fg">Detalhes</h2>
            <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
              <dt className="text-fg-faint">Categoria</dt>
              <dd>{cat?.label}</dd>
              {product.subs.length > 0 && (
                <>
                  <dt className="text-fg-faint">Coleções</dt>
                  <dd>{product.subs.map((s) => SUB_LABELS[s] ?? s).join(", ")}</dd>
                </>
              )}
              <dt className="text-fg-faint">Referência</dt>
              <dd className="font-mono text-xs">{product.handle}</dd>
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="relacionados">
          <h2 id="relacionados" className="display mb-6 text-4xl">
            Combina com
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
