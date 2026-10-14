/**
 * Identidade visual da Boneti — arquivos originais servidos pelo CDN da loja (Shopify).
 * Nada aqui foi recriado: logo e foto são os mesmos usados em bonetistore.com.
 */
const CDN = "https://cdn.shopify.com/s/files/1/0779/9822/7738/files/";

/**
 * Logo branca com fundo transparente (3000×3000).
 * A marca ocupa ~3–97% da largura e ~30–71% da altura do arquivo; o componente
 * BrandLogo recorta essa margem com um box de proporção LOGO_RATIO e object-cover.
 */
export const LOGO_URL = `${CDN}LogoBonetiBranca.png`;
export const LOGO_RATIO = 2.33;

/**
 * Fundo do hero: paisagem minimalista de Foz do Iguaçu ao entardecer.
 * Mostra as Cataratas, Marco das Três Fronteiras e Ponte da Amizade ao pôr do sol.
 */
export const HERO_PHOTO_URL = `/hero-foz-do-iguacu.png`;
