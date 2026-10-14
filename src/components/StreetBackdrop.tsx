"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import { PRODUCTS, img } from "@/lib/catalog";

/**
 * Fundo do hero: "parede de lambe-lambe" com fotos reais do catálogo da Boneti,
 * em P&B e alto contraste, com pichação, spray e escorrido por cima.
 * Tudo é decorativo (aria-hidden). A parede desliza com a rolagem (parallax).
 */

// Uma foto por linha de tênis, para a parede ficar variada.
const LINES = ["air-max", "dunk", "jordan", "shox", "air-force", "new-balance", "asics", "court-borough", "tenis-nocta", "adidas", "vapormax", "court-vision"];
const WALL = (() => {
  const picked = LINES.map((l) => PRODUCTS.find((p) => p.subs.includes(l) && p.available && p.images[0])).filter(Boolean) as typeof PRODUCTS;
  const extra = PRODUCTS.filter((p) => p.category !== "tenis" && p.available && p.images[0]).slice(0, 6);
  return [...picked, ...extra].slice(0, 16);
})();

// rotação/deslocamento fixos por pôster (determinístico, sem Math.random no render)
const TILT = [-3, 2, -1.5, 4, -4, 1, 3, -2.5, 2.5, -3.5, 1.5, -1, 3.5, -2, 0.5, -4.5];

export function StreetBackdrop({ progress }: { progress: MotionValue<number> }) {
  const wallY = useTransform(progress, [0, 1], ["0%", "-18%"]);
  const tagX = useTransform(progress, [0, 1], ["0%", "-12%"]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* parede de pôsteres */}
      <motion.div style={{ y: wallY }} className="absolute -inset-x-[5%] -top-[5%] grid h-[130%] grid-cols-4 gap-2 sm:grid-cols-6 lg:grid-cols-8">
        {WALL.map((p, i) => (
          <div
            key={p.handle}
            className="relative overflow-hidden bg-neutral-900"
            style={{ transform: `rotate(${TILT[i % TILT.length]}deg) scale(1.04)` }}
          >
            <Image
              src={img(p.images[0], 400)}
              alt=""
              fill
              sizes="(min-width: 1024px) 13vw, (min-width: 640px) 17vw, 25vw"
              className="object-cover opacity-60 grayscale contrast-[1.35] brightness-75"
            />
            {/* fita adesiva no canto de alguns pôsteres */}
            {i % 3 === 0 && <span className="absolute -top-1 left-1/2 h-4 w-12 -translate-x-1/2 rotate-[-4deg] bg-white/25" />}
          </div>
        ))}
      </motion.div>

      {/* concreto + vinheta: escurece as bordas e deixa o centro respirar para o 3D */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_45%,rgba(11,11,12,0.55)_0%,rgba(11,11,12,0.88)_60%,#0b0b0c_100%)]" />
      <div className="halftone absolute inset-0 opacity-40 mix-blend-overlay" />

      {/* spray lime atrás do tênis */}
      <div className="spray absolute left-1/2 top-[40%] h-[60vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2" />

      {/* tag gigante */}
      <motion.div style={{ x: tagX }} className="absolute inset-x-0 top-[9vh] flex justify-center">
        <svg viewBox="0 0 1200 360" className="w-[115vw] max-w-none opacity-90 sm:w-[90vw]">
          <defs>
            <filter id="rough" x="-5%" y="-5%" width="110%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" />
              <feDisplacementMap in="SourceGraphic" scale="7" />
            </filter>
            <filter id="mist" x="-20%" y="-40%" width="140%" height="180%">
              <feGaussianBlur stdDeviation="14" />
            </filter>
          </defs>
          {/* névoa do spray */}
          <text x="600" y="250" textAnchor="middle" className="tag-font" fontSize="250" fill="#c8ff3d" opacity="0.22" filter="url(#mist)">
            Boneti
          </text>
          {/* contorno + preenchimento */}
          <g filter="url(#rough)" transform="rotate(-5 600 180)">
            <text x="600" y="250" textAnchor="middle" className="tag-font" fontSize="250" fill="none" stroke="#0b0b0c" strokeWidth="18" strokeLinejoin="round">
              Boneti
            </text>
            <text x="600" y="250" textAnchor="middle" className="tag-font" fontSize="250" fill="#c8ff3d" opacity="0.62">
              Boneti
            </text>
            {/* escorridos */}
            {[
              [395, 262, 70],
              [520, 268, 110],
              [690, 262, 55],
              [820, 270, 90],
            ].map(([x, y, h]) => (
              <g key={x} fill="#c8ff3d" opacity="0.62">
                <rect x={x} y={y} width="7" height={h} rx="3.5" />
                <circle cx={x + 3.5} cy={y + h} r="6" />
              </g>
            ))}
          </g>
        </svg>
      </motion.div>

      {/* pichações pequenas espalhadas */}
      {/* nos cantos, longe dos textos dos capítulos (meio-esquerda, meio-direita e base central) */}
      <span className="marker absolute left-[4%] top-[14%] hidden rotate-[-8deg] text-3xl text-white/30 md:block">Foz do Iguaçu</span>
      <span className="marker absolute right-[4%] top-[13%] hidden rotate-[6deg] text-2xl text-accent-2/55 md:block">+100k pedidos</span>
      <span className="marker absolute bottom-[8%] right-[5%] hidden rotate-[-4deg] text-2xl text-white/25 md:block">since day one</span>

      {/* grão de concreto nas bordas */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
