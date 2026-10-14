import Link from "next/link";
import { CATEGORIES, STREET_BRANDS, SUB_LABELS } from "@/lib/catalog";

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-elev">
      <div className="mx-auto max-w-[1400px] px-5 pt-14 sm:px-8">
        <p className="display text-[18vw] leading-[0.8] text-white/[0.04] sm:text-[12vw]" aria-hidden>
          Boneti
        </p>
      </div>
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 pb-14 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="display text-3xl">
            BONETI<span className="text-accent">.</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-fg-muted">
            Streetwear e sneakers em Foz do Iguaçu-PR, enviando para todo o Brasil. Atendimento de segunda a sábado, 9h–18h, pelo WhatsApp (45) 99142-2244.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-widest text-fg-faint">
            <span className="rounded-sm border border-line px-2.5 py-1">Pix 5% off</span>
            <span className="rounded-sm border border-line px-2.5 py-1">Cartão 12x</span>
            <span className="rounded-sm border border-line px-2.5 py-1">Boleto</span>
          </div>
        </div>
        <nav aria-label="Categorias">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-fg-faint">Categorias</h3>
          <ul className="space-y-2 text-sm text-fg-muted">
            {CATEGORIES.map((c) => (
              <li key={c.key}>
                <Link href={`/catalogo?cat=${c.key}`} className="hover:text-fg">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Marcas">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-fg-faint">Marcas</h3>
          <ul className="space-y-2 text-sm text-fg-muted">
            {STREET_BRANDS.filter((b) => SUB_LABELS[b]).map((b) => (
              <li key={b}>
                <Link href={`/catalogo?sub=${b}`} className="hover:text-fg">
                  {SUB_LABELS[b]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Ajuda">
          <h3 className="mb-3 text-[10px] font-bold uppercase tracking-[0.25em] text-fg-faint">Ajuda</h3>
          <ul className="space-y-2 text-sm text-fg-muted">
            {["Trocas e devoluções", "Rastrear pedido", "Guia de tamanhos", "Política de frete", "Privacidade", "Fale conosco"].map((l) => (
              <li key={l}>
                <Link href="#" className="hover:text-fg">
                  {l}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-5 text-[11px] text-fg-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 Boneti Store · Protótipo de redesign por HUB33 Inteligência Criativa · Catálogo e fotos: Boneti Store</span>
          <span>
            Modelo 3D ilustrativo “Materials Variants Shoe” © Shopify, via Khronos glTF Sample Assets —{" "}
            <a href="https://creativecommons.org/licenses/by/4.0/" className="underline underline-offset-2 hover:text-fg" rel="license noreferrer" target="_blank">
              CC BY 4.0
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
