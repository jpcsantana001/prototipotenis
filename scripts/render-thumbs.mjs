/**
 * Pré-renderiza as thumbs do catálogo a partir do modelo 3D.
 *
 *   1. npm run build && npm run start   (ou npm run dev)
 *   2. node scripts/render-thumbs.mjs [baseUrl]
 *
 * Gera public/thumbs/<variant>.webp (1200×960, fundo transparente).
 * Requer `playwright` instalado (npm i -D playwright) e um Chromium disponível.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const base = process.argv[2] ?? "http://localhost:3000";
const variants = ["Street", "Beach", "Midnight"];

await mkdir("public/thumbs", { recursive: true });

const browser = await chromium.launch({
  // Use CHROMIUM_PATH para apontar um executável específico (ex.: versão pré-instalada).
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1200, height: 960 }, deviceScaleFactor: 1 });

for (const v of variants) {
  await page.goto(`${base}/dev/thumb?variant=${v}`, { waitUntil: "networkidle" });
  // espera o GLB carregar e a variante ser aplicada
  await page.waitForSelector("canvas");
  await page.waitForTimeout(2500);
  const png = await page.screenshot({ omitBackground: true, clip: { x: 0, y: 0, width: 1200, height: 960 } });
  const out = `public/thumbs/${v.toLowerCase()}.webp`;
  await sharp(png).trim({ threshold: 2 }).resize({ width: 1200, height: 960, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).webp({ quality: 88, alphaQuality: 90 }).toFile(out);
  console.log("✓", out);
}

await browser.close();
