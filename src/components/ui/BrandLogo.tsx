import Image from "next/image";
import { LOGO_RATIO, LOGO_URL } from "@/lib/brand";

/**
 * Logo oficial da Boneti. O arquivo é quadrado com muita margem transparente;
 * o box tem a proporção da marca e o object-cover recorta a sobra de cima e de baixo.
 * Defina a largura pela className (ex.: "w-28").
 */
export function BrandLogo({ className = "", priority = false, sizes = "160px" }: { className?: string; priority?: boolean; sizes?: string }) {
  return (
    <span className={`relative block ${className}`} style={{ aspectRatio: String(LOGO_RATIO) }}>
      <Image src={`${LOGO_URL}?width=1000`} alt="Boneti Store" fill sizes={sizes} priority={priority} className="object-cover" />
    </span>
  );
}
