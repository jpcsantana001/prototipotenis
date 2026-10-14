/**
 * Variantes de cor do modelo 3D ilustrativo (/public/models/shoe.glb),
 * embutidas via KHR_materials_variants: "street", "beach", "midnight".
 * O catálogo real fica em ./catalog.ts.
 */

export type VariantName = "Street" | "Beach" | "Midnight";

export interface Colorway {
  variant: VariantName;
  label: string;
  hex: string;
  accent: string;
}

export const COLORWAYS: Record<VariantName, Colorway> = {
  Street: { variant: "Street", label: "Preto Street", hex: "#2b2b2e", accent: "#c8ff3d" },
  Beach: { variant: "Beach", label: "Rosa Beach", hex: "#e9c4c8", accent: "#ff8fa8" },
  Midnight: { variant: "Midnight", label: "Azul Midnight", hex: "#1f8fd6", accent: "#3fa9ff" },
};
