"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import fozBanner from "@/assets/foz-banner.webp";
import { BrandLogo } from "@/components/ui/BrandLogo";

/**
 * Fundo do hero:
 * - banner "Foz do Iguaçu" (arte fornecida pela HUB33: Cataratas, Marco das Três
 *   Fronteiras, Ponte da Amizade e pixos), em src/assets/foz-banner.webp;
 * - logo oficial da Boneti no centro, entre o "FOZ DO IGUAÇU" e o "045" da arte.
 * Tudo decorativo (aria-hidden). O banner desliza e aproxima com a rolagem.
 */
export function StreetBackdrop({ progress }: { progress: MotionValue<number> }) {
  const bgY = useTransform(progress, [0, 1], ["0%", "-8%"]);
  const bgScale = useTransform(progress, [0, 1], [1.02, 1.15]);
  const logoY = useTransform(progress, [0, 1], ["0%", "-30%"]);
  // na abertura a arte aparece inteira; nos capítulos seguintes escurece para o texto ler bem
  const dim = useTransform(progress, [0, 0.14, 0.24, 1], [0, 0, 0.55, 0.55]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div style={{ y: bgY, scale: bgScale }} className="absolute inset-x-0 -bottom-[5%] top-0">
        <Image
          src={fozBanner}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[45%_50%]"
        />
      </motion.div>

      {/* escurece o centro (onde ficam o tênis e os textos) e as bordas de cima e de baixo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_50%_at_50%_48%,rgba(11,11,12,0.55)_0%,rgba(11,11,12,0.25)_70%,rgba(11,11,12,0.45)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-bg/90 to-transparent" />
      <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-bg" />

      {/* logo oficial, entre o "FOZ DO IGUAÇU" e o "045" do banner */}
      <motion.div style={{ y: logoY }} className="absolute inset-x-0 top-[11vh] flex justify-center">
        <BrandLogo className="w-[62vw] opacity-90 drop-shadow-[0_0_30px_rgba(0,0,0,0.8)] sm:w-[42vw] lg:w-[30vw]" sizes="62vw" priority />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
