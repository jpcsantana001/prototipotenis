/**
 * Catálogo REAL da Boneti Store, importado da Shopify Storefront
 * (/products.json + /collections/<handle>/products.json) em 14/10/2026.
 *
 * Formato compacto em src/data/catalog.json (uma linha por produto):
 *   [handle, título, preço, preçoDe|null, [img1, img2], categoria, [subcoleções], "tamanhos", promo, disponível]
 *   - tamanhos: "38,39,40!,41" → "!" marca tamanho esgotado
 *   - imagens: nome do arquivo no CDN da loja (ver IMG_BASE)
 *
 * Em produção isto vira uma chamada à Storefront API; a função `fromRow`
 * é o único lugar que precisa mudar.
 */
import rows from "@/data/catalog.json";

export const IMG_BASE = "https://cdn.shopify.com/s/files/1/0779/9822/7738/files/";

export type Category =
  | "tenis"
  | "chinelos"
  | "camisetas"
  | "moletons"
  | "conjuntos"
  | "jaquetas"
  | "calcas"
  | "shorts"
  | "bones"
  | "acessorios";

export interface SizeOption {
  label: string;
  available: boolean;
}

export interface Product {
  handle: string;
  title: string;
  /** Título sem o prefixo de categoria ("TÊNIS ", "CAMISETA "…) e com capitalização normal. */
  name: string;
  /** Parte depois do " - " (cor/colorway), quando existe. */
  variantLabel: string | null;
  price: number;
  compareAt: number | null;
  discount: number;
  images: string[];
  category: Category;
  subs: string[];
  sizes: SizeOption[];
  promo: boolean;
  available: boolean;
  /** true para itens da coleção "tênis" — habilita o visualizador 3D (demo). */
  has3d: boolean;
}

export const CATEGORIES: { key: Category; label: string; short: string }[] = [
  { key: "tenis", label: "Tênis", short: "Tênis" },
  { key: "camisetas", label: "Camisetas", short: "Tees" },
  { key: "moletons", label: "Moletons", short: "Moletom" },
  { key: "conjuntos", label: "Conjuntos", short: "Sets" },
  { key: "calcas", label: "Calças", short: "Calças" },
  { key: "shorts", label: "Shorts", short: "Shorts" },
  { key: "jaquetas", label: "Jaquetas", short: "Jaquetas" },
  { key: "bones", label: "Bonés", short: "Bonés" },
  { key: "chinelos", label: "Chinelos", short: "Slides" },
  { key: "acessorios", label: "Acessórios", short: "Acess." },
];

/** Rótulos das subcoleções (modelos e marcas), como a loja nomeia. */
export const SUB_LABELS: Record<string, string> = {
  "air-max": "Air Max",
  "air-force": "Air Force",
  dunk: "Dunk",
  jordan: "Jordan",
  shox: "12 Molas",
  vapormax: "Vapormax",
  "court-vision": "Court Vision",
  "court-borough": "Court Borough",
  adidas: "Adidas",
  "new-balance": "New Balance",
  asics: "Asics",
  "tenis-nocta": "Nocta",
  "tenis-griffe": "Griffes",
  premium: "Premium",
  oversized: "Oversized",
  "camisa-polo": "Polo",
  "camisetas-dri-fit": "Dri-Fit",
  "camisas-de-time": "Time",
  femininas: "Femininas",
  "calca-jeans": "Jeans",
  "calca-baggy": "Baggy",
  "calca-moletom": "Moletom",
  supreme: "Supreme",
  bape: "Bape",
  corteiz: "Corteiz",
  trapstar: "Trapstar",
  "syna-world": "Syna World",
  "denim-tears": "Denim Tears",
  sp5der: "Sp5der",
  hellstar: "Hellstar",
  "chrome-hearts": "Chrome Hearts",
};

/** Subcoleções que são "marcas de streetwear" (vitrine de marcas na home). */
export const STREET_BRANDS = ["corteiz", "syna-world", "supreme", "bape", "hellstar", "sp5der", "chrome-hearts", "denim-tears", "trapstar"];

/** Subcoleções que são "modelos de tênis". */
export const SNEAKER_LINES = ["air-max", "dunk", "air-force", "jordan", "shox", "court-vision", "court-borough", "vapormax", "tenis-nocta", "adidas", "new-balance", "asics", "tenis-griffe"];

const PREFIX = /^(TÊNIS|CAMISETA|MOLETOM|CONJUNTO|CALÇA|SHORTS|BONÉ|CHINELO|JAQUETA|CORTA VENTO|MEIA|RELÓGIO|ÓCULOS|CARTEIRA|PORTA CARTÃO|TOUCA|PULSEIRA|CUECA|PACK)\s+/i;

function titleCase(s: string): string {
  const keep = new Set(["NK", "ADD", "NB", "GC", "LV", "LCST", "PM", "SB", "TN", "DN", "DN8", "R4", "TL", "SP", "MJ", "BS", "CK", "MMW", "NBA", "EWT", "FC", "AMG", "BMW", "OG", "RTW", "NYC", "USA", "NY", "H86", "9060", "530", "2000", "95", "97", "90", "1", "4", "11", "3.0", "2.0", "23", "02", "01", "12", "25"]);
  return s
    .toLowerCase()
    .split(" ")
    .map((w) => {
      const up = w.toUpperCase();
      if (keep.has(up)) return up;
      if (/^\d/.test(w)) return up;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(" ");
}

type Row = [string, string, number, number | null, string[], string, string[], string, number, number];

function fromRow(r: Row): Product {
  const [handle, title, price, compareAt, imgs, category, subs, sizesStr, promo, available] = r;
  const stripped = title.replace(PREFIX, "");
  const dash = stripped.indexOf(" - ");
  const base = dash >= 0 ? stripped.slice(0, dash) : stripped;
  const variant = dash >= 0 ? stripped.slice(dash + 3) : null;
  const sizes = sizesStr
    ? sizesStr.split(",").map((s) => ({ label: s.replace(/!$/, "").trim(), available: !s.endsWith("!") }))
    : [];
  return {
    handle,
    title,
    name: titleCase(base.trim()),
    variantLabel: variant ? titleCase(variant.trim()) : null,
    price,
    compareAt,
    discount: compareAt && compareAt > price ? Math.round((1 - price / compareAt) * 100) : 0,
    images: imgs.map((i) => IMG_BASE + i),
    category: category as Category,
    subs,
    sizes,
    promo: promo === 1,
    available: available === 1,
    has3d: category === "tenis",
  };
}

export const PRODUCTS: Product[] = (rows as Row[]).map(fromRow);

const byHandle = new Map(PRODUCTS.map((p) => [p.handle, p]));
export function getProduct(handle: string): Product | undefined {
  return byHandle.get(handle);
}

export function byCategory(cat: Category): Product[] {
  return PRODUCTS.filter((p) => p.category === cat);
}

export function bySub(sub: string): Product[] {
  return PRODUCTS.filter((p) => p.subs.includes(sub));
}

export function countBy(key: (p: Product) => string[] | string): Record<string, number> {
  const out: Record<string, number> = {};
  for (const p of PRODUCTS) {
    const v = key(p);
    for (const k of Array.isArray(v) ? v : [v]) out[k] = (out[k] ?? 0) + 1;
  }
  return out;
}

/** URL de imagem do CDN Shopify com largura solicitada (o CDN redimensiona). */
export function img(url: string, width = 800): string {
  return `${url}${url.includes("?") ? "&" : "?"}width=${width}`;
}

export function formatBRL(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function installment(value: number, n = 12): string {
  return formatBRL(value / n);
}

/** Lista "todos os tamanhos" por categoria, para o filtro. */
export function sizesFor(cat: Category | null): string[] {
  const set = new Set<string>();
  for (const p of PRODUCTS) {
    if (cat && p.category !== cat) continue;
    for (const s of p.sizes) if (!s.label.includes("/") || p.category === "chinelos") set.add(s.label);
  }
  return [...set].sort((a, b) => {
    const na = parseFloat(a);
    const nb = parseFloat(b);
    if (!isNaN(na) && !isNaN(nb)) return na - nb;
    const order = ["P", "M", "G", "GG", "XG"];
    return order.indexOf(a) - order.indexOf(b);
  });
}
