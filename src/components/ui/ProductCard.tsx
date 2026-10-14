"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SUB_LABELS, formatBRL, img, installment, type Product } from "@/lib/catalog";
import { TiltCard } from "./TiltCard";

/** Foto do produto com troca para a 2ª imagem no hover e fallback se o CDN falhar. */
export function ProductImage({ product, priority = false, sizes }: { product: Product; priority?: boolean; sizes: string }) {
  const [failed, setFailed] = useState(false);
  const [hover, setHover] = useState(false);
  const src = product.images[hover && product.images[1] ? 1 : 0];

  if (failed || !src) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-bg-elev">
        <span className="display text-5xl text-white/10">{product.category}</span>
      </div>
    );
  }
  return (
    <div className="relative h-full w-full" onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)}>
      <Image
        src={img(src, 800)}
        alt={product.title}
        fill
        sizes={sizes}
        priority={priority}
        onError={() => setFailed(true)}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
    </div>
  );
}

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const line = product.subs.find((s) => SUB_LABELS[s]);
  return (
    <TiltCard className="group rounded-card" max={6}>
      <Link
        href={`/produto/${product.handle}`}
        className="block overflow-hidden rounded-card border border-line bg-bg-card transition-colors hover:border-white/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-bg-elev">
          <ProductImage product={product} priority={priority} sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, (min-width: 640px) 45vw, 90vw" />

          {/* badges */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.discount > 0 && (
              <span className="sticker display rounded-sm bg-accent-2 px-2 py-0.5 text-sm text-white">-{product.discount}%</span>
            )}
            {product.has3d && (
              <span className="rounded-sm border border-white/30 bg-black/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white/90 backdrop-blur">
                3D
              </span>
            )}
          </div>
          {!product.available && (
            <div className="absolute inset-x-0 bottom-0 bg-black/70 py-1.5 text-center text-[11px] font-semibold uppercase tracking-widest text-white/80 backdrop-blur">
              Esgotado
            </div>
          )}

          {/* tamanhos disponíveis aparecem no hover (desktop) */}
          {product.sizes.length > 0 && product.available && (
            <div className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-black/80 px-3 py-2 text-[11px] text-white/80 backdrop-blur transition-transform duration-300 group-hover:translate-y-0">
              <span className="mr-1 text-white/50">Tam.</span>
              {product.sizes.filter((s) => s.available).map((s) => s.label).join(" · ")}
            </div>
          )}
        </div>

        <div className="p-3.5">
          {line && <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">{SUB_LABELS[line]}</p>}
          <h3 className="line-clamp-1 text-sm font-semibold">{product.name}</h3>
          {product.variantLabel && <p className="line-clamp-1 text-xs text-fg-muted">{product.variantLabel}</p>}
          <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-2">
            <div className="flex items-baseline gap-1.5">
              <span className="font-semibold">{formatBRL(product.price)}</span>
              {product.compareAt && <s className="text-[11px] text-fg-faint">{formatBRL(product.compareAt)}</s>}
            </div>
            <span className="text-[10px] text-fg-muted">12x {installment(product.price)}</span>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-bg-card">
      <div className="skeleton aspect-[4/5]" />
      <div className="space-y-2 p-3.5">
        <div className="skeleton h-3 w-1/3 rounded" />
        <div className="skeleton h-4 w-2/3 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
      </div>
    </div>
  );
}
