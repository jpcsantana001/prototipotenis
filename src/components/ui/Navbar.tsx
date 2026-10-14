"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "./Cart";

const LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/catalogo?tag=Oferta", label: "Ofertas" },
  { href: "/#historia", label: "A marca" },
];

export function Navbar() {
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 transition-colors duration-300 ${
        scrolled || menu ? "border-b border-line bg-bg/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="font-display text-xl font-bold tracking-tight" aria-label="Boneti Store — início">
          BONETI<span className="text-accent">.</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-fg-muted md:flex" aria-label="Principal">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="transition hover:text-fg">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
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
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[11px] font-semibold text-white">
                {count}
              </span>
            )}
          </button>
          <button
            onClick={() => setMenu((m) => !m)}
            className="rounded-full p-2.5 transition hover:bg-white/5 md:hidden"
            aria-label="Menu"
            aria-expanded={menu}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              {menu ? <path d="M18 6 6 18M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menu && (
        <nav className="border-t border-line px-5 py-4 md:hidden" aria-label="Principal (mobile)">
          <ul className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setMenu(false)} className="block rounded-lg px-3 py-2.5 text-fg-muted hover:bg-white/5 hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
