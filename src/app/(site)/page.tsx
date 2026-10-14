import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ui/ProductCard";
import { PRODUCTS } from "@/lib/products";

const FEATURES = [
  {
    title: "Veja em 360°",
    body: "Todo produto tem modelo 3D real. Gire, aproxime e confira detalhes de textura, cadarço e solado.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
        <circle cx="12" cy="12" r="9" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" />
        <path d="M12 3v18" />
      </svg>
    ),
  },
  {
    title: "Troca de cor em tempo real",
    body: "Compare as três colorways no mesmo ângulo, sem recarregar. O que você vê é o que chega.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
        <path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-2 0-3 2 0 3 0 3-1 3-3a9 9 0 0 0-8-10Z" />
        <circle cx="8" cy="10" r="1" />
        <circle cx="12" cy="7" r="1" />
        <circle cx="16" cy="10" r="1" />
      </svg>
    ),
  },
  {
    title: "Entrega para todo o Brasil",
    body: "Mais de 100 mil pedidos enviados. Rastreio em tempo real e troca grátis em até 30 dias.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-6 w-6">
        <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" />
        <circle cx="7" cy="18" r="1.6" />
        <circle cx="17" cy="18" r="1.6" />
      </svg>
    ),
  },
];

const MARQUEE = ["+100 mil pedidos", "Até 12x sem juros", "Troca grátis em 30 dias", "Envio em 24h", "Atendimento humano no WhatsApp"];

export default function Home() {
  const featured = PRODUCTS.filter((p) => p.tag).slice(0, 3);

  return (
    <>
      <Hero />

      {/* marquee */}
      <div className="overflow-hidden border-y border-line bg-bg-elev py-3" aria-hidden>
        <div className="marquee flex w-max gap-10 whitespace-nowrap text-xs font-semibold uppercase tracking-[0.25em] text-fg-muted">
          {[...MARQUEE, ...MARQUEE].map((m, i) => (
            <span key={i} className="flex items-center gap-10">
              {m} <span className="h-1 w-1 rounded-full bg-accent" />
            </span>
          ))}
        </div>
      </div>

      {/* destaques */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28" aria-labelledby="destaques">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">Destaques</span>
            <h2 id="destaques" className="mt-2 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Os mais pedidos da semana
            </h2>
          </div>
          <Link href="/catalogo" className="text-sm text-fg-muted underline-offset-4 hover:text-fg hover:underline">
            Ver todos os {PRODUCTS.length} modelos →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <ProductCard key={p.slug} product={p} priority={i === 0} />
          ))}
        </div>
      </section>

      {/* por que */}
      <section id="historia" className="border-t border-line bg-bg-elev" aria-labelledby="porque">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">A marca</span>
            <h2 id="porque" className="mt-2 text-balance font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Comprar tênis online sem a dúvida do “será que é assim mesmo?”
            </h2>
            <p className="mt-4 text-lg text-fg-muted">
              A Boneti nasceu em Umuarama e cresceu no WhatsApp, uma foto de cada vez. Agora cada modelo vira um objeto 3D que você
              examina como se estivesse na loja.
            </p>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-card border border-line bg-bg-card p-6">
                <div className="mb-5 inline-flex rounded-xl bg-accent/15 p-3 text-accent">{f.icon}</div>
                <h3 className="font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="relative overflow-hidden" aria-labelledby="cta">
        <div className="glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <h2 id="cta" className="text-balance font-display text-4xl font-bold tracking-tight sm:text-6xl">
            Seu próximo par está a um giro de distância.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-fg-muted">Explore o catálogo completo em 3D. Sem cadastro, sem app.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/catalogo" className="rounded-full bg-fg px-7 py-3.5 text-sm font-semibold text-bg transition hover:bg-white">
              Ver catálogo
            </Link>
            <Link
              href="/produto/runner-midnight"
              className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold transition hover:border-white/50"
            >
              Abrir um modelo em 3D
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
