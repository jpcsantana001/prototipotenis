import Image from "next/image";
import Link from "next/link";
import { COLORWAYS, formatBRL, installment, type Product } from "@/lib/products";
import { TiltCard } from "./TiltCard";

const TAG_STYLE: Record<NonNullable<Product["tag"]>, string> = {
  Novo: "bg-accent text-white",
  "Mais vendido": "bg-fg text-bg",
  Oferta: "bg-accent-2 text-white",
};

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const color = COLORWAYS[product.colorway];
  const discount = product.compareAt ? Math.round((1 - product.price / product.compareAt) * 100) : 0;

  return (
    <TiltCard className="group rounded-card" max={8}>
      <Link
        href={`/produto/${product.slug}`}
        className="block overflow-hidden rounded-card border border-line bg-bg-card transition-colors hover:border-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      >
        <div
          className="relative aspect-[5/4] overflow-hidden"
          style={{ background: `radial-gradient(ellipse 80% 70% at 50% 60%, ${color.hex}55 0%, var(--bg-card) 70%)` }}
        >
          {/* glow que reage ao tilt (fica "atrás" do tênis) */}
          <div
            aria-hidden
            className="tilt-layer absolute inset-[18%] rounded-full opacity-60 blur-3xl"
            style={{ background: color.accent, ["--tz" as string]: "-40px", ["--px" as string]: "-14px", ["--py" as string]: "-14px" }}
          />
          <div
            className="tilt-layer absolute inset-0"
            style={{ ["--tz" as string]: "40px", ["--px" as string]: "10px", ["--py" as string]: "8px" }}
          >
            <Image
              src={product.image}
              alt={`${product.name} visto de lado`}
              fill
              sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
              className="object-contain p-6 drop-shadow-[0_30px_30px_rgba(0,0,0,0.55)] transition-transform duration-500 group-hover:scale-[1.06]"
              priority={priority}
            />
          </div>
          {product.tag && (
            <span className={`absolute left-4 top-4 rounded-full px-2.5 py-1 text-[11px] font-semibold ${TAG_STYLE[product.tag]}`}>
              {product.tag}
              {product.tag === "Oferta" && discount > 0 ? ` · -${discount}%` : ""}
            </span>
          )}
        </div>

        <div className="p-5">
          <h3 className="font-display text-base font-semibold">Boneti {product.line}</h3>
          <p className="mt-0.5 flex items-center gap-2 text-sm text-fg-muted">
            <span className="inline-block h-3 w-3 rounded-full ring-1 ring-white/20" style={{ background: color.hex }} />
            {color.label}
          </p>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-t border-line pt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-semibold">{formatBRL(product.price)}</span>
              {product.compareAt && <s className="text-xs text-fg-faint">{formatBRL(product.compareAt)}</s>}
            </div>
            <p className="text-[11px] text-fg-muted">12x de {installment(product.price)}</p>
          </div>
        </div>
      </Link>
    </TiltCard>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-bg-card">
      <div className="skeleton aspect-[5/4]" />
      <div className="space-y-2 p-5">
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
  );
}
