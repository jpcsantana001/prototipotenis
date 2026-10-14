"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "motion/react";
import fozSunset from "@/assets/foz-sunset.webp";
import { BrandLogo } from "@/components/ui/BrandLogo";

/**
 * Fundo do hero, sobre preto puro:
 * - ilustração "Foz do Iguaçu ao pôr do sol" (Cataratas, Marco das Três Fronteiras
 *   e Ponte da Amizade), fornecida pela HUB33, em src/assets/foz-sunset.webp;
 *   as bordas se dissolvem no preto por máscara (sem emenda visível);
 * - logo oficial da Boneti no céu, acima do tênis 3D.
 * Tudo decorativo (aria-hidden). A imagem desliza e aproxima com a rolagem.
 */
export function StreetBackdrop({ progress }: { progress: MotionValue<number> }) {
  const bgY = useTransform(progress, [0, 1], ["0%", "-6%"]);
  const bgScale = useTransform(progress, [0, 1], [1, 1.12]);
  const logoY = useTransform(progress, [0, 1], ["0%", "-30%"]);
  // depois da abertura escurece um pouco para os textos laterais lerem bem
  const dim = useTransform(progress, [0, 0.14, 0.24, 1], [0, 0, 0.4, 0.4]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black" aria-hidden>
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-x-0 -bottom-[4%] top-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_38%,black_78%,transparent_100%),linear-gradient(to_right,transparent_0%,black_14%,black_86%,transparent_100%)] [mask-composite:intersect] [-webkit-mask-composite:source-in]"
      >
        <Image
          src={fozSunset}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-[55%_70%]"
        />
      </motion.div>

      <motion.div style={{ opacity: dim }} className="absolute inset-0 bg-black" />

      {/* logo oficial no céu */}
      <motion.div style={{ y: logoY }} className="absolute inset-x-0 top-[11vh] flex justify-center">
        <BrandLogo className="w-[62vw] opacity-95 sm:w-[42vw] lg:w-[30vw]" sizes="62vw" priority />
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
