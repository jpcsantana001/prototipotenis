"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { COLORWAYS, type VariantName } from "@/lib/products";
import { variantForProgress } from "@/components/three/HeroScene";

// Canvas só no cliente (three.js não roda no servidor) e fora do bundle inicial.
const HeroScene = dynamic(() => import("@/components/three/HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest text-fg-faint">Carregando 3D…</div>,
});

/* ------------------------------------------------------------------ */
/* Capítulos do storytelling                                           */
/* ------------------------------------------------------------------ */

interface Chapter {
  range: [number, number];
  eyebrow: string;
  title: React.ReactNode;
  body: string;
  align: "left" | "right" | "center";
}

const CHAPTERS: Chapter[] = [
  {
    range: [0, 0.18],
    eyebrow: "Nova coleção 2026",
    title: (
      <>
        Veja antes de <span className="text-accent">calçar.</span>
      </>
    ),
    body: "Cada tênis da Boneti em 3D real. Gire, aproxime, troque de cor — e escolha com a certeza de quem já experimentou.",
    align: "center",
  },
  {
    range: [0.22, 0.42],
    eyebrow: "Construção",
    title: "Knit respirável. Entressola de alto retorno.",
    body: "Cabedal em tricô sem costuras aparentes, reforço termocolado nos pontos de flexão e solado com padrão de tração em ondas.",
    align: "left",
  },
  {
    range: [0.47, 0.68],
    eyebrow: "Três colorways",
    title: "Street. Midnight. Beach.",
    body: "Troque de cor em tempo real na página do produto. O que você vê aqui é o mesmo modelo que chega na sua casa.",
    align: "right",
  },
  {
    range: [0.74, 1],
    eyebrow: "Pronto?",
    title: "Encontre o seu.",
    body: "Mais de 100 mil pedidos enviados para todo o Brasil. Em até 12x, com troca grátis em 30 dias.",
    align: "left",
  },
];

function ChapterBlock({ chapter, progress }: { chapter: Chapter; progress: MotionValue<number> }) {
  const [a, b] = chapter.range;
  const fade = 0.05;
  // Offsets precisam ficar em [0, 1] e ser estritamente crescentes (motion acelera via
  // ScrollTimeline/WAAPI; offsets duplicados fazem o 1º keyframe "vencer" no extremo).
  const stops: number[] = [];
  const op: number[] = [];
  const ty: number[] = [];
  if (a > 0) {
    stops.push(a - fade, a);
    op.push(0, 1);
    ty.push(28, 0);
  } else {
    stops.push(0);
    op.push(1);
    ty.push(0);
  }
  if (b < 1) {
    stops.push(b, b + fade);
    op.push(1, 0);
    ty.push(0, -28);
  } else {
    stops.push(1);
    op.push(1);
    ty.push(0);
  }
  const opacity = useTransform(progress, stops, op);
  const y = useTransform(progress, stops, ty);

  const pos =
    chapter.align === "center"
      ? "left-1/2 bottom-[10vh] -translate-x-1/2 items-center text-center"
      : chapter.align === "left"
        ? "left-0 top-1/2 -translate-y-1/2 items-start text-left"
        : "right-0 top-1/2 -translate-y-1/2 items-end text-right";

  return (
    <motion.div
      style={{ opacity, y }}
      className={`pointer-events-none absolute flex w-full max-w-xl flex-col gap-4 px-6 sm:px-10 md:max-w-lg ${pos} max-md:inset-x-0 max-md:bottom-[8vh] max-md:top-auto max-md:translate-x-0 max-md:translate-y-0 max-md:items-start max-md:text-left`}
    >
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">{chapter.eyebrow}</span>
      <h2 className="text-balance font-display text-4xl font-bold leading-[1.02] tracking-tight sm:text-5xl md:text-6xl">
        {chapter.title}
      </h2>
      <p className="max-w-md text-balance text-base text-fg-muted sm:text-lg">{chapter.body}</p>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const reduced = useReducedMotion() ?? false;
  const [variant, setVariant] = useState<VariantName>("Street");
  const [isMobile, setIsMobile] = useState(false);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = variantForProgress(v);
    setVariant((cur) => (cur === next ? cur : next));
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setIsMobile(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // CTA final aparece no último capítulo (precisa de pointer-events)
  const ctaOpacity = useTransform(scrollYProgress, [0.74, 0.8], [0, 1]);
  const ctaPointer = useTransform(scrollYProgress, (v) => (v > 0.76 ? "auto" : "none"));
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const dotsProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative h-[480vh]" aria-label="Apresentação da coleção">
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* fundo */}
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="glow absolute inset-0" style={{ ["--glow" as string]: COLORWAYS[variant].accent }} aria-hidden />

        {/* cena 3D */}
        <HeroScene progress={scrollYProgress} variant={variant} reducedMotion={reduced} isMobile={isMobile} />

        {/* textos */}
        {CHAPTERS.map((c) => (
          <ChapterBlock key={c.eyebrow} chapter={c} progress={scrollYProgress} />
        ))}

        {/* CTA do último capítulo */}
        <motion.div
          style={{ opacity: ctaOpacity, pointerEvents: ctaPointer }}
          className="absolute left-6 top-[calc(50%+7.5rem)] flex flex-wrap gap-3 sm:left-10 max-md:bottom-[2.5vh] max-md:top-auto"
        >
          <Link
            href="/catalogo"
            className="rounded-full bg-fg px-6 py-3 text-sm font-semibold text-bg transition hover:bg-white"
          >
            Ver catálogo
          </Link>
          <Link
            href="/produto/runner-street"
            className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold backdrop-blur transition hover:border-white/50"
          >
            Experimentar em 3D
          </Link>
        </motion.div>

        {/* dica de scroll */}
        <motion.div
          style={{ opacity: hintOpacity }}
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[11px] uppercase tracking-[0.3em] text-fg-faint"
          aria-hidden
        >
          Role
          <span className="block h-8 w-px overflow-hidden bg-white/10">
            <motion.span
              className="block h-3 w-px bg-fg"
              animate={reduced ? undefined : { y: [-12, 32] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
            />
          </span>
        </motion.div>

        {/* barra de progresso vertical */}
        <div className="absolute right-5 top-1/2 hidden h-32 w-px -translate-y-1/2 bg-white/10 md:block" aria-hidden>
          <motion.div className="w-px bg-fg" style={{ height: dotsProgress }} />
        </div>
      </div>
    </section>
  );
}
