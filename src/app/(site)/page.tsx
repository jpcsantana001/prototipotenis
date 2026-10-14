import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { ProductCard } from "@/components/ui/ProductCard";
import { CATEGORIES, PRODUCTS, SNEAKER_LINES, STREET_BRANDS, SUB_LABELS, byCategory, bySub, countBy, img, type Category } from "@/lib/catalog";

const subCounts = countBy((p) => p.subs);
const catCounts = countBy((p) => p.category);

function cover(cat: Category) {
  return byCategory(cat).find((p) => p.available && p.images[0]) ?? byCategory(cat)[0];
}

const TAPE = ["Air Max", "Dunk", "Jordan", "12 Molas", "Air Force", "New Balance", "Asics", "Corteiz", "Syna World", "Supreme", "Bape", "Hellstar", "Chrome Hearts", "Sp5der"];

export default function Home() {
  const fresh = PRODUCTS.filter((p) => p.available && p.images[0]).slice(0, 8);
  const deals = PRODUCTS.filter((p) => p.available && p.discount > 0)
    .sort((a, b) => b.discount - a.discount)
    .slice(0, 4);
  const sneakers = SNEAKER_LINES.filter((s) => subCounts[s] >= 3).slice(0, 8);
  const brands = STREET_BRANDS.filter((b) => subCounts[b]);

  return (
    <>
      <Hero />

      {/* fita de modelos */}
      <div className="tape overflow-hidden py-3" aria-hidden>
        <div className="marquee-rev display flex w-max gap-10 whitespace-nowrap text-3xl">
          {[...TAPE, ...TAPE].map((m, i) => (
            <span key={i} className="flex items-center gap-10">
              {m} <span className="h-2 w-2 rounded-full bg-accent-ink" />
            </span>
          ))}
        </div>
      </div>

      {/* chegou agora */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24" aria-labelledby="novos">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Drop da semana</span>
            <h2 id="novos" className="display mt-1 text-6xl sm:text-7xl">
              Chegou agora
            </h2>
          </div>
          <Link href="/catalogo" className="text-xs font-semibold uppercase tracking-wider text-fg-muted underline-offset-4 hover:text-fg hover:underline">
            Ver todos os {PRODUCTS.length} produtos →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {fresh.map((p, i) => (
            <ProductCard key={p.handle} product={p} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* categorias em tiles grandes */}
      <section className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24" aria-labelledby="cats">
        <h2 id="cats" className="sr-only">
          Categorias
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 md:grid-rows-2">
          {CATEGORIES.slice(0, 7).map((c, i) => {
            const p = cover(c.key);
            const big = i === 0;
            return (
              <Link
                key={c.key}
                href={`/catalogo?cat=${c.key}`}
                className={`group relative overflow-hidden rounded-card border border-line bg-bg-card ${big ? "col-span-2 row-span-2 aspect-square md:aspect-auto" : "aspect-[4/5] md:aspect-auto md:min-h-56"}`}
              >
                {p?.images[0] && (
                  <Image src={img(p.images[0], big ? 1200 : 700)} alt="" fill sizes={big ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 768px) 25vw, 50vw"} className="object-cover opacity-80 transition duration-700 group-hover:scale-105 group-hover:opacity-100" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 sm:p-5">
                  <span className={`display ${big ? "text-6xl sm:text-8xl" : "text-3xl sm:text-4xl"}`}>{c.label}</span>
                  <span className="rounded-sm bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest backdrop-blur">{catCounts[c.key]}</span>
                </div>
              </Link>
            );
          })}
          <Link href="/catalogo?promo=1" className="group relative flex aspect-[4/5] items-end overflow-hidden rounded-card bg-accent p-4 text-accent-ink sm:p-5 md:aspect-auto md:min-h-56">
            <span className="display text-3xl leading-[0.9] sm:text-4xl">
              Até
              <br />
              50%
              <br />
              off
            </span>
            <span className="display absolute right-4 top-4 text-7xl opacity-20 transition group-hover:opacity-40">→</span>
          </Link>
        </div>
      </section>

      {/* modelos de tênis */}
      <section className="border-y border-line bg-bg-elev" aria-labelledby="modelos">
        <div className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">{catCounts.tenis} modelos em 3D</span>
              <h2 id="modelos" className="display mt-1 text-6xl sm:text-7xl">
                Escolha a linha
              </h2>
            </div>
            <Link href="/catalogo?cat=tenis" className="text-xs font-semibold uppercase tracking-wider text-fg-muted underline-offset-4 hover:text-fg hover:underline">
              Todos os tênis →
            </Link>
          </div>
          <div className="scrollbar-none -mx-5 flex snap-x gap-3 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-4 sm:px-0 lg:grid-cols-8">
            {sneakers.map((s) => {
              const p = bySub(s).find((x) => x.available && x.images[0]);
              return (
                <Link key={s} href={`/catalogo?cat=tenis&sub=${s}`} className="group relative w-40 shrink-0 snap-start overflow-hidden rounded-card border border-line bg-bg-card sm:w-auto">
                  <div className="relative aspect-square">
                    {p?.images[0] && <Image src={img(p.images[0], 500)} alt="" fill sizes="(min-width: 1024px) 12vw, 40vw" className="object-cover transition duration-500 group-hover:scale-105" />}
                  </div>
                  <div className="flex items-center justify-between px-3 py-2.5">
                    <span className="display text-xl">{SUB_LABELS[s]}</span>
                    <span className="text-[10px] text-fg-muted">{subCounts[s]}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* marcas de rua */}
      <section className="mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24" aria-labelledby="marcas">
        <div className="mb-8">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Streetwear</span>
          <h2 id="marcas" className="display mt-1 text-6xl sm:text-7xl">
            As marcas da rua
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {brands.map((b) => (
            <Link key={b} href={`/catalogo?sub=${b}`} className="display rounded-sm border border-line px-5 py-3 text-3xl transition hover:border-accent hover:text-accent sm:text-4xl">
              {SUB_LABELS[b]} <span className="text-base text-fg-faint">{subCounts[b]}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* promos */}
      {deals.length > 0 && (
        <section className="mx-auto max-w-[1400px] px-5 pb-16 sm:px-8 sm:pb-24" aria-labelledby="promos">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent-2">Queima</span>
              <h2 id="promos" className="display mt-1 text-6xl sm:text-7xl">
                Até 50% off
              </h2>
            </div>
            <Link href="/catalogo?promo=1" className="text-xs font-semibold uppercase tracking-wider text-fg-muted underline-offset-4 hover:text-fg hover:underline">
              Todas as ofertas →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
            {deals.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* pitch 3D */}
      <section id="historia" className="relative overflow-hidden border-t border-line" aria-labelledby="pitch">
        <div className="glow absolute inset-0" aria-hidden />
        <div className="relative mx-auto grid max-w-[1400px] gap-10 px-5 py-20 sm:px-8 sm:py-28 md:grid-cols-2">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">Por que 3D</span>
            <h2 id="pitch" className="display mt-1 text-balance text-6xl sm:text-7xl">
              Menos “será que é assim?”, mais compra.
            </h2>
          </div>
          <div className="space-y-5 text-fg-muted">
            <p>
              A Boneti cresceu no WhatsApp, uma foto por vez. O catálogo já tem mais de 600 produtos e 380 tênis — e cada venda ainda depende de a foto convencer.
            </p>
            <p>
              Com modelos 3D por SKU, o cliente gira, aproxima e compara cores antes de pedir. Menos dúvida no atendimento, menos troca por expectativa errada, mais tempo em página.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/produto/tenis-nk-air-max-95-x-corteiz-pink-beam" className="display rounded-sm bg-accent px-6 py-3 text-xl text-accent-ink transition hover:brightness-110">
                Testar o 3D
              </Link>
              <Link href="/catalogo" className="display rounded-sm border border-white/30 px-6 py-3 text-xl transition hover:border-accent hover:text-accent">
                Ver catálogo
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
