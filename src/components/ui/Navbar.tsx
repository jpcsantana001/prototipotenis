"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./Cart";
import { BrandLogo } from "./BrandLogo";
import { CATEGORIES, SNEAKER_LINES, STREET_BRANDS, SUB_LABELS } from "@/lib/catalog";

const TOP = [
  { href: "/catalogo?cat=tenis", label: "Tênis" },
  { href: "/catalogo?cat=camisetas", label: "Camisetas" },
  { href: "/catalogo?cat=moletons", label: "Moletons" },
  { href: "/catalogo?cat=conjuntos", label: "Conjuntos" },
  { href: "/catalogo?cat=calcas", label: "Calças" },
  { href: "/catalogo?cat=bones", label: "Bonés" },
  { href: "/catalogo?promo=1", label: "Até 50% off", hot: true },
];

export function Navbar() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [mega, setMega] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || menu || mega ? "border-b border-line bg-bg/80 backdrop-blur-xl" : "bg-transparent"
      }`}
      onMouseLeave={() => setMega(false)}
    >
      {/* fita de aviso */}
      <div className="tape overflow-hidden text-[11px] font-bold uppercase tracking-[0.2em]">
        <div className="marquee flex w-max gap-10 whitespace-nowrap py-1">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-10">
              <span>+ de 100 mil pedidos enviados para todo o Brasil</span>
              <span>·</span>
              <span>Até 12x sem juros</span>
              <span>·</span>
              <span>Troca grátis em 30 dias</span>
              <span>·</span>
              <span>Envio em 24h</span>
              <span>·</span>
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <Link href="/" aria-label="Boneti Store — início" className="shrink-0">
          <BrandLogo className="w-24 sm:w-28" priority sizes="112px" />
        </Link>

        <nav className="hidden items-center gap-6 text-[13px] font-medium uppercase tracking-wider text-fg-muted lg:flex" aria-label="Principal">
          {TOP.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onMouseEnter={() => setMega(l.label === "Tênis")}
              className={`transition hover:text-fg ${l.hot ? "text-accent hover:text-accent" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link href="/catalogo" className="hidden rounded-full p-2.5 transition hover:bg-white/5 md:block" aria-label="Buscar no catálogo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </Link>
          <button
            onClick={() => setOpen(true)}
            className="relative rounded-full p-2.5 transition hover:bg-white/5"
            aria-label={`Abrir carrinho (${count} ${count === 1 ? "item" : "itens"})`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 7h12l1 13H5L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-bold text-accent-ink">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenu((m) => !m)}
            className="rounded-full p-2.5 transition hover:bg-white/5 lg:hidden"
            aria-label="Menu"
            aria-expanded={menu}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {menu ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* mega menu de tênis */}
      {mega && (
        <div className="hidden border-t border-line lg:block" onMouseEnter={() => setMega(true)}>
          <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_1fr_1.2fr] gap-10 px-8 py-6">
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-fg-faint">Modelos</p>
              <ul className="grid grid-cols-2 gap-1.5 text-sm">
                {SNEAKER_LINES.map((s) => (
                  <li key={s}>
                    <Link href={`/catalogo?cat=tenis&sub=${s}`} onClick={() => setMega(false)} className="text-fg-muted hover:text-fg">
                      {SUB_LABELS[s]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-fg-faint">Marcas de rua</p>
              <ul className="grid grid-cols-2 gap-1.5 text-sm">
                {STREET_BRANDS.filter((b) => SUB_LABELS[b]).map((s) => (
                  <li key={s}>
                    <Link href={`/catalogo?sub=${s}`} onClick={() => setMega(false)} className="text-fg-muted hover:text-fg">
                      {SUB_LABELS[s]}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              href="/produto/tenis-nk-air-max-95-x-corteiz-pink-beam"
              onClick={() => setMega(false)}
              className="group relative flex items-end overflow-hidden rounded-card border border-line bg-bg-card p-5"
            >
              <div className="glow absolute inset-0" aria-hidden />
              <div className="relative">
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-accent">Destaque</span>
                <p className="display mt-1 text-3xl">Veja em 3D antes de comprar</p>
                <p className="mt-1 text-xs text-fg-muted">Gire, aproxime, confira cada detalhe →</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* menu mobile */}
      {menu && (
        <nav className="max-h-[80vh] overflow-y-auto border-t border-line px-5 py-4 lg:hidden" aria-label="Principal (mobile)">
          <ul className="grid grid-cols-2 gap-1">
            {CATEGORIES.map((c) => (
              <li key={c.key}>
                <Link href={`/catalogo?cat=${c.key}`} onClick={() => setMenu(false)} className="display block rounded-lg px-3 py-2.5 text-2xl hover:bg-white/5">
                  {c.label}
                </Link>
              </li>
            ))}
            <li className="col-span-2">
              <Link href="/catalogo?promo=1" onClick={() => setMenu(false)} className="display block rounded-lg bg-accent px-3 py-2.5 text-2xl text-accent-ink">
                Até 50% off
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
