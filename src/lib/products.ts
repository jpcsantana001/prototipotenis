/**
 * Dados de demonstração do catálogo.
 *
 * Em produção isto viria do Shopify Storefront API (ou outro headless commerce).
 * Os três colorways correspondem às variantes KHR_materials_variants embutidas
 * no modelo /public/models/shoe.glb ("Street", "Beach", "Midnight").
 */

export type VariantName = "Street" | "Beach" | "Midnight";

export interface Colorway {
  /** Nome da variante dentro do GLB. */
  variant: VariantName;
  /** Nome comercial exibido ao usuário. */
  label: string;
  /** Cor dominante usada em swatches, glows e fundos. */
  hex: string;
  /** Cor secundária (detalhe lateral). */
  accent: string;
}

export const COLORWAYS: Record<VariantName, Colorway> = {
  Street: { variant: "Street", label: "Preto Street", hex: "#2b2b2e", accent: "#ff5c8a" },
  Beach: { variant: "Beach", label: "Rosa Beach", hex: "#e9c4c8", accent: "#c0707d" },
  Midnight: { variant: "Midnight", label: "Azul Midnight", hex: "#1f8fd6", accent: "#143f7a" },
};

export type Line = "Runner" | "Street" | "Lite";

export interface Product {
  slug: string;
  name: string;
  line: Line;
  colorway: VariantName;
  price: number;
  compareAt?: number;
  sizes: number[];
  /** Tamanhos esgotados (demo de estado "indisponível"). */
  soldOut?: number[];
  description: string;
  highlights: string[];
  tag?: "Novo" | "Mais vendido" | "Oferta";
  /** Thumb pré-renderizada do modelo 3D (gerada por scripts/render-thumbs.mjs). */
  image: string;
}

export const SIZES = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44];

const LINE_INFO: Record<Line, { base: number; blurb: string; highlights: string[] }> = {
  Runner: {
    base: 249.9,
    blurb:
      "Malha respirável em tricô com reforço termocolado, entressola em EVA expandido e solado com padrão de tração em ondas. Feito para o dia inteiro.",
    highlights: ["Cabedal em knit respirável", "Entressola EVA de alto retorno", "Palmilha removível antibacteriana"],
  },
  Street: {
    base: 279.9,
    blurb:
      "A versão urbana: mesmo cabedal em knit, cadarço grosso e detalhe lateral em contraste. Pensado para combinar com qualquer look.",
    highlights: ["Cadarço grosso encerado", "Detalhe lateral em TPU", "Solado de borracha vulcanizada"],
  },
  Lite: {
    base: 219.9,
    blurb:
      "O mais leve da coleção: 230 g no 40. Construção minimalista sem costuras aparentes e solado de baixo perfil.",
    highlights: ["230 g (tam. 40)", "Sem costuras aparentes", "Solado de baixo perfil"],
  },
};

function makeProduct(line: Line, colorway: VariantName, extra: Partial<Product> = {}): Product {
  const info = LINE_INFO[line];
  const color = COLORWAYS[colorway];
  const slug = `${line.toLowerCase()}-${colorway.toLowerCase()}`;
  return {
    slug,
    name: `Boneti ${line} — ${color.label}`,
    line,
    colorway,
    price: info.base,
    sizes: SIZES,
    description: info.blurb,
    highlights: info.highlights,
    image: `/thumbs/${colorway.toLowerCase()}.webp`,
    ...extra,
  };
}

export const PRODUCTS: Product[] = [
  makeProduct("Runner", "Street", { tag: "Mais vendido", soldOut: [34, 44] }),
  makeProduct("Runner", "Midnight", { tag: "Novo" }),
  makeProduct("Runner", "Beach", { soldOut: [35, 36] }),
  makeProduct("Street", "Street", { compareAt: 329.9, tag: "Oferta" }),
  makeProduct("Street", "Midnight", { soldOut: [43, 44] }),
  makeProduct("Street", "Beach", { tag: "Novo" }),
  makeProduct("Lite", "Street", { soldOut: [34] }),
  makeProduct("Lite", "Midnight", { compareAt: 259.9, tag: "Oferta" }),
  makeProduct("Lite", "Beach"),
];

export const LINES: Line[] = ["Runner", "Street", "Lite"];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function installment(value: number, n = 12): string {
  return formatBRL(value / n);
}
