import Link from "next/link";

const COLS = [
  {
    title: "Loja",
    links: [
      { label: "Todos os tênis", href: "/catalogo" },
      { label: "Ofertas", href: "/catalogo?tag=Oferta" },
      { label: "Lançamentos", href: "/catalogo?tag=Novo" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { label: "Trocas e devoluções", href: "#" },
      { label: "Rastrear pedido", href: "#" },
      { label: "Guia de tamanhos", href: "#" },
      { label: "Fale conosco", href: "#" },
    ],
  },
  {
    title: "Políticas",
    links: [
      { label: "Privacidade", href: "#" },
      { label: "Frete", href: "#" },
      { label: "Termos de serviço", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-bg-elev">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="font-display text-2xl font-bold tracking-tight">
            BONETI<span className="text-accent">.</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-fg-muted">
            Tênis para o dia inteiro. Atendimento de segunda a sábado, 9h–18h, pelo WhatsApp.
          </p>
          <div className="mt-5 flex gap-2 text-[11px] uppercase tracking-widest text-fg-faint">
            <span className="rounded-full border border-line px-3 py-1">Pix</span>
            <span className="rounded-full border border-line px-3 py-1">Cartão 12x</span>
            <span className="rounded-full border border-line px-3 py-1">Boleto</span>
          </div>
        </div>
        {COLS.map((c) => (
          <nav key={c.title} aria-label={c.title}>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-fg-faint">{c.title}</h3>
            <ul className="space-y-2 text-sm text-fg-muted">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="transition hover:text-fg">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-5 text-[11px] text-fg-faint sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© 2026 Boneti Store · Protótipo de redesign por HUB33 Inteligência Criativa</span>
          <span>
            Modelo 3D “Materials Variants Shoe” © Shopify, via Khronos glTF Sample Assets —{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              className="underline underline-offset-2 hover:text-fg"
              rel="license noreferrer"
              target="_blank"
            >
              CC BY 4.0
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
