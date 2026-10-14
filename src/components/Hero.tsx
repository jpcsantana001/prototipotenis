"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { COLORWAYS, type VariantName } from "@/lib/products";
import { variantForProgress } from "@/components/three/HeroScene";

const HeroScene = dynamic(() => import("@/components/three/HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => <div className="absolute inset-0 flex items-center justify-center text-[10px] uppercase tracking-[0.3em] text-fg-faint">Carregando 3D…</div>,
});

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
    eyebrow: "Boneti Store · Umuarama → Brasil",
    title: (
      <>
        Veja antes
        <br />
        de <span className="text-accent">calçar.</span>
      </>
    ),
    body: "Sneakers e streetwear com visualização 3D. Gire, aproxime, troque de cor — e compre com a certeza de quem já experimentou.",
    align: "center",
  },
  {
    range: [0.22, 0.42],
    eyebrow: "Cada detalhe",
    title: "Costura, solado, cadarço. Tudo à vista.",
    body: "No site atual você compra por uma foto. Aqui, cada tênis vira um objeto que você examina como na loja.",
    align: "left",
  },
  {
    range: [0.47, 0.68],
    eyebrow: "Troca de cor em tempo real",
    title: "Street. Midnight. Beach.",
    body: "Compare colorways no mesmo ângulo, sem recarregar. O que você vê é o que chega.",
    align: "right",
  },
  {
    range: [0.74, 1],
    eyebrow: "+600 produtos reais no catálogo",
    title: "Explore o drop.",
    body: "Air Max, Dunk, Jordan, 12 Molas, Corteiz, Syna, Supreme e mais — em até 12x, com troca grátis em 30 dias.",
    align: "left",
  },
];

/** Keyframes com offsets sempre em [0,1] e estritamente crescentes (motion acelera via ScrollTimeline). */
function useChapterMotion(progress: MotionValue<number>, [a, b]: [number, number]) {
  const fade = 0.05;
  const stops: number[] = [];
  const op: number[] = [];
  const ty: number[] = [];
  if (a > 0) {
    stops.push(0, a - fade, a);
    op.push(0, 0, 1);
    ty.push(28, 28, 0);
  } else {
    stops.push(0);
    op.push(1);
    ty.push(0);
  }
  if (b < 1) {
    stops.push(b, b + fade, 1);
    op.push(1, 0, 0);
    ty.push(0, -28, -28);
  } else {
    stops.push(1);
    op.push(1);
    ty.push(0);
  }
  return { opacity: useTransform(progress, stops, op), y: useTransform(progress, stops, ty) };
}

function ChapterBlock({ chapter, progress }: { chapter: Chapter; progress: MotionValue<number> }) {
  const { opacity, y } = useChapterMotion(progress, chapter.range);
  const pos =
    chapter.align === "center"
      ? "left-1/2 bottom-[7vh] -translate-x-1/2 items-center text-center"
      : chapter.align === "left"
        ? "left-0 top-1/2 -translate-y-1/2 items-start text-left"
        : "right-0 top-1/2 -translate-y-1/2 items-end text-right";

  return (
    <motion.div
      style={{ opacity, y }}
      className={`pointer-events-none absolute flex w-full max-w-2xl flex-col gap-4 px-6 sm:px-10 md:max-w-xl ${pos} max-md:inset-x-0 max-md:bottom-[8vh] max-md:top-auto max-md:translate-x-0 max-md:translate-y-0 max-md:items-start max-md:text-left`}
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">{chapter.eyebrow}</span>
      <h2 className="display text-balance text-6xl sm:text-7xl md:text-8xl">{chapter.title}</h2>
      <p className="max-w-md text-balance text-sm text-fg-muted sm:text-base">{chapter.body}</p>
    </motion.div>
  );
}

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

  const ctaOpacity = useTransform(scrollYProgress, [0, 0.74, 0.8, 1], [0, 0, 1, 1]);
  const ctaPointer = useTransform(scrollYProgress, (v) => (v > 0.76 ? "auto" : "none"));
  const hintOpacity = useTransform(scrollYProgress, [0, 0.06, 1], [1, 0, 0]);
  const barH = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={ref} className="relative h-[420vh]" aria-label="Apresentação">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="bg-grid absolute inset-0" aria-hidden />
        <div className="glow absolute inset-0" style={{ ["--glow" as string]: COLORWAYS[variant].accent }} aria-hidden />

        {/* wordmark gigante atrás do tênis */}
        <div className="pointer-events-none absolute inset-x-0 top-[18vh] flex justify-center" aria-hidden>
          <span className="display text-[26vw] leading-none text-white/[0.035]">BONETI</span>
        </div>

        <HeroScene progress={scrollYProgress} variant={variant} reducedMotion={reduced} isMobile={isMobile} />

        {CHAPTERS.map((c) => (
          <ChapterBlock key={c.eyebrow} chapter={c} progress={scrollYProgress} />
        ))}

        <motion.div
          style={{ opacity: ctaOpacity, pointerEvents: ctaPointer }}
          className="absolute left-6 top-[calc(50%+9rem)] flex flex-wrap gap-3 sm:left-10 max-md:bottom-[2.5vh] max-md:top-auto"
        >
          <Link href="/catalogo?cat=tenis" className="display rounded-sm bg-accent px-6 py-3 text-xl text-accent-ink transition hover:brightness-110">
            Ver tênis
          </Link>
          <Link href="/catalogo" className="display rounded-sm border border-white/30 px-6 py-3 text-xl backdrop-blur transition hover:border-accent hover:text-accent">
            Catálogo completo
          </Link>
        </motion.div>

        <motion.div style={{ opacity: hintOpacity }} className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-fg-faint" aria-hidden>
          Role
          <span className="block h-8 w-px overflow-hidden bg-white/10">
            <motion.span className="block h-3 w-px bg-accent" animate={reduced ? undefined : { y: [-12, 32] }} transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }} />
          </span>
        </motion.div>

        <div className="absolute right-5 top-1/2 hidden h-32 w-px -translate-y-1/2 bg-white/10 md:block" aria-hidden>
          <motion.div className="w-px bg-accent" style={{ height: barH }} />
        </div>
      </div>
    </section>
  );
}
