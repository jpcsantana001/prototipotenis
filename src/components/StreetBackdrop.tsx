"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import { HERO_PHOTO_URL } from "@/lib/brand";
import { BrandLogo } from "@/components/ui/BrandLogo";

/**
 * Fundo do hero com material original da Boneti:
 * - foto da campanha da loja (banner do site, recortado sem o texto impresso);
 * - logo oficial grande, com névoa de spray atrás.
 * Tudo decorativo (aria-hidden). A foto desliza com a rolagem (parallax).
 */
export function StreetBackdrop({ progress }: { progress: MotionValue<number> }) {
  const photoY = useTransform(progress, [0, 1], ["0%", "-10%"]);
  const photoScale = useTransform(progress, [0, 1], [1.05, 1.18]);
  const logoY = useTransform(progress, [0, 1], ["0%", "-30%"]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {/* foto da campanha */}
      <motion.div style={{ y: photoY, scale: photoScale }} className="absolute inset-x-0 -bottom-[5%] top-0">
        <Image
          src={HERO_PHOTO_URL}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_35%] opacity-70 saturate-[1.15]"
        />
      </motion.div>

      {/* escurece em volta e no topo, deixando o centro respirar para o tênis 3D */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_50%_45%,rgba(11,11,12,0.45)_0%,rgba(11,11,12,0.82)_65%,#0b0b0c_100%)]" />
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-bg to-transparent" />
      <div className="halftone absolute inset-0 opacity-30 mix-blend-overlay" />

      {/* névoa de spray atrás da logo e do tênis */}
      <div className="spray absolute left-1/2 top-[30%] h-[55vmin] w-[85vmin] -translate-x-1/2 -translate-y-1/2" />

      {/* logo oficial grande */}
      <motion.div style={{ y: logoY }} className="absolute inset-x-0 top-[10vh] flex justify-center">
        <BrandLogo className="w-[78vw] opacity-80 drop-shadow-[0_0_40px_rgba(200,255,61,0.35)] sm:w-[58vw] lg:w-[46vw]" sizes="80vw" priority />
      </motion.div>

      {/* pichações nos cantos, longe dos textos dos capítulos */}
      <span className="marker absolute left-[4%] top-[14%] hidden rotate-[-8deg] text-3xl text-white/35 md:block">Foz do Iguaçu</span>
      <span className="marker absolute right-[4%] top-[13%] hidden rotate-[6deg] text-2xl text-accent-2/60 md:block">+100k pedidos</span>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
